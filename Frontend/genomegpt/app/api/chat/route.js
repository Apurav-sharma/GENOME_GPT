import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
// import dotenv from "dotenv";

const API = process.env.API_KEY;
console.log(API);

// Initialize Groq client
const groq = new Groq({
    apiKey: API, // Set your Groq API key in .env.local
});

// In-memory storage for conversations
const conversations = new Map();

// Function to check if a message is health-related
async function isHealthRelated(message) {
    try {
        const healthCheckPrompt = `
You are a content filter. Your job is to determine if a user's message is related to health, medical topics, wellness, fitness, nutrition, mental health, or healthcare.

Analyze this message and respond with only "YES" if it's health-related, or "NO" if it's not health-related.

Health-related topics include but are not limited to:
- Medical conditions, symptoms, diseases
- Medications and treatments
- Mental health and psychology
- Fitness and exercise
- Nutrition and diet
- Healthcare systems
- Preventive care
- Wellness and self-care
- Medical procedures
- Health advice or tips

User message: "${message}"

Response (YES or NO only):`;

        const healthCheck = await groq.chat.completions.create({
            messages: [{
                role: 'user',
                content: healthCheckPrompt
            }],
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            temperature: 0.1,
            max_tokens: 10,
        });

        const response = healthCheck.choices[0]?.message?.content?.trim().toLowerCase();
        return response === 'yes';
    } catch (error) {
        console.error('Error checking if message is health-related:', error);
        // If we can't check, err on the side of caution and allow it
        return true;
    }
}

export async function POST(request) {
    try {
        const { message, sessionId = 'default' } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Check if the message is health-related
        const isHealthQuestion = await isHealthRelated(message);
        
        if (!isHealthQuestion) {
            return NextResponse.json({
                response: "I'm sorry, but I can only assist with health-related questions. Please ask me something about health, medical topics, wellness, fitness, nutrition, mental health, or healthcare.",
                sessionId: sessionId,
                conversationLength: 0,
                filtered: true
            });
        }

        // Get or create conversation history
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                {
                    role: 'system',
                    content: 'You are a helpful AI health assistant. You specialize in providing information about health, medical topics, wellness, fitness, nutrition, mental health, and healthcare. Be concise, friendly, and informative in your responses. Always remind users to consult healthcare professionals for serious medical concerns and that your advice should not replace professional medical consultation.'
                }
            ]);
        }

        const conversation = conversations.get(sessionId);

        // Add user message to conversation history
        conversation.push({
            role: 'user',
            content: message
        });

        // Keep only last 20 messages to prevent token limit issues
        if (conversation.length > 20) {
            // Keep system message and last 19 messages
            const systemMessage = conversation[0];
            const recentMessages = conversation.slice(-19);
            conversations.set(sessionId, [systemMessage, ...recentMessages]);
        }

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: conversations.get(sessionId),
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            temperature: 0.7,
            max_tokens: 1000,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        // Add AI response to conversation history
        conversation.push({
            role: 'assistant',
            content: aiResponse
        });

        return NextResponse.json({
            response: aiResponse,
            sessionId: sessionId,
            conversationLength: conversation.length - 1, // Exclude system message from count
            filtered: false
        });

    } catch (error) {
        console.error('Error calling Groq API:', error);
        return NextResponse.json(
            {
                error: 'Failed to get AI response',
                details: error.message
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId') || 'default';

        const conversation = conversations.get(sessionId);

        if (!conversation) {
            return NextResponse.json({
                messages: [],
                conversationLength: 0
            });
        }

        // Return conversation without system message
        const userMessages = conversation.slice(1);

        return NextResponse.json({
            messages: userMessages,
            conversationLength: userMessages.length,
            sessionId: sessionId
        });

    } catch (error) {
        console.error('Error fetching conversation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversation' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId') || 'default';

        conversations.delete(sessionId);

        return NextResponse.json({
            message: 'Conversation cleared successfully',
            sessionId: sessionId
        });

    } catch (error) {
        console.error('Error clearing conversation:', error);
        return NextResponse.json(
            { error: 'Failed to clear conversation' },
            { status: 500 }
        );
    }
}