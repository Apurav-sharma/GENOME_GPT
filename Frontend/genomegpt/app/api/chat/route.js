import { NextResponse } from "next/server";
import OpenAI from "openai";

const API = process.env.OPENAI_API_KEY;

// OpenAI client
const openai = new OpenAI({
  apiKey: API,
});

// In-memory conversations
const conversations = new Map();

export async function POST(request) {
  try {
    const { message, sessionId = "default" } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Initialize conversation
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, [
        {
          role: "system",
          content: `
You are a AI Health Assistant, your name is GENOMEGPT.

Rules:
1. answer health-related questions (medical, nutrition, fitness, mental health).
2. Be concise and factual.
3. Always remind users to consult a healthcare professional.
`
        }
      ]);
    }

    const conversation = conversations.get(sessionId);

    // Add user message
    conversation.push({
      role: "user",
      content: message,
    });

    // Keep last 20 messages
    if (conversation.length > 20) {
      const systemMessage = conversation[0];
      const recent = conversation.slice(-19);
      conversations.set(sessionId, [systemMessage, ...recent]);
    }

    // Single OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // change if needed
      messages: conversations.get(sessionId),
      temperature: 0.4,
      max_tokens: 800,
    });

    const aiResponse =
      completion.choices[0]?.message?.content || "No response generated.";

    // Save assistant reply
    conversation.push({
      role: "assistant",
      content: aiResponse,
    });

    return NextResponse.json({
      response: aiResponse,
      sessionId,
      conversationLength: conversation.length - 1,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response", details: error.message },
      { status: 500 }
    );
  }
}

// Get conversation
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "default";

    const conversation = conversations.get(sessionId) || [];
    const messages = conversation.slice(1); // remove system msg

    return NextResponse.json({
      messages,
      conversationLength: messages.length,
      sessionId,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

// Clear conversation
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "default";

    conversations.delete(sessionId);

    return NextResponse.json({
      message: "Conversation cleared",
      sessionId,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to clear conversation" }, { status: 500 });
  }
}
