'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() =>
        `session_${Math.random().toString(36).substr(2, 9)}`
    );
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversation history on component mount
    useEffect(() => {
        fetchConversationHistory();
    }, []);

    const fetchConversationHistory = async () => {
        try {
            const response = await fetch(`/api/chat?sessionId=${sessionId}`);
            const data = await response.json();

            if (response.ok && data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        // Add user message to UI
        const newUserMessage = { role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: sessionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            // Add AI response to UI
            const aiMessage = { role: 'assistant', content: data.response };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message to UI
            const errorMessage = {
                role: 'assistant',
                content: `Error: ${error.message}. Please try again.`,
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearConversation = async () => {
        try {
            await fetch(`/api/chat?sessionId=${sessionId}`, {
                method: 'DELETE',
            });
            setMessages([]);
        } catch (error) {
            console.error('Error clearing conversation:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto max-w-4xl h-screen flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm border-b p-4 rounded-t-lg mt-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">AI Chat Assistant</h1>
                            <p className="text-sm text-gray-600">Powered by Groq LLM</p>
                        </div>
                        <button
                            onClick={clearConversation}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                            Clear Chat
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🤖</div>
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                    Welcome to AI Chat
                                </h2>
                                <p className="text-gray-500">
                                    Start a conversation by typing a message below
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${message.role === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : message.isError
                                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <div className="text-sm font-medium mb-1">
                                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                                        </div>
                                        <div className="text-sm whitespace-pre-wrap">
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg bg-gray-100">
                                        <div className="text-sm font-medium mb-1">AI Assistant</div>
                                        <div className="flex items-center space-x-1">
                                            <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"></div>
                                            <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full delay-100"></div>
                                            <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t p-4 rounded-b-lg mb-4">
                    <div className="flex space-x-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here... (Press Enter to send)"
                            className="flex-1 p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="2"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? (
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                                'Send'
                            )}
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Session ID: {sessionId} • Messages are stored in memory
                    </div>
                </div>
            </div>
        </div>
    );
}