/**
 * AI Chat Panel Component - Enhanced
 * Story 7.5: AI NLP Queries
 * 
 * Enhanced chat with page citations, confidence indicators, and conversation memory
 */
import React, { useState, useRef, useEffect } from 'react';

interface Citation {
    fileId: string;
    fileName: string;
    pageNumber: number;
    snippet: string;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
    confidence?: 'high' | 'medium' | 'low';
    isStreaming?: boolean;
}

interface AIChatPanelProps {
    projectId: string;
    userId: string;
    apiBaseUrl: string;
    authToken: string;
    onViewFile?: (fileId: string, pageNumber?: number) => void;
}

const ConfidenceBadge: React.FC<{ level: 'high' | 'medium' | 'low' }> = ({ level }) => {
    const config = {
        high: { bg: 'bg-green-100', text: 'text-green-700', label: '✓ High confidence' },
        medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '◐ Medium confidence' },
        low: { bg: 'bg-red-100', text: 'text-red-700', label: '⚠ Low confidence' },
    };
    const { bg, text, label } = config[level];

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {label}
        </span>
    );
};

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
    projectId,
    userId,
    apiBaseUrl,
    authToken,
    onViewFile,
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const assistantId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: assistantId,
            role: 'assistant',
            content: '',
            isStreaming: true,
        }]);

        try {
            const response = await fetch(`${apiBaseUrl}/ai/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ projectId, query: input.trim(), userId }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let citations: Citation[] = [];
            let confidence: 'high' | 'medium' | 'low' = 'medium';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const text = decoder.decode(value);
                    const lines = text.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));

                                if (data.type === 'citations') {
                                    citations = data.citations;
                                    confidence = data.confidence || 'medium';
                                } else if (data.type === 'chunk') {
                                    setMessages(prev => prev.map(m =>
                                        m.id === assistantId
                                            ? { ...m, content: m.content + data.content }
                                            : m
                                    ));
                                } else if (data.type === 'done') {
                                    setMessages(prev => prev.map(m =>
                                        m.id === assistantId
                                            ? { ...m, isStreaming: false, citations, confidence }
                                            : m
                                    ));
                                } else if (data.type === 'error') {
                                    setMessages(prev => prev.map(m =>
                                        m.id === assistantId
                                            ? { ...m, content: `Error: ${data.message}`, isStreaming: false, confidence: 'low' }
                                            : m
                                    ));
                                }
                            } catch (e) {
                                // Skip invalid JSON
                            }
                        }
                    }
                }
            }
        } catch (error: any) {
            setMessages(prev => prev.map(m =>
                m.id === assistantId
                    ? { ...m, content: `Error: ${error.message}`, isStreaming: false }
                    : m
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearHistory = async () => {
        try {
            await fetch(`${apiBaseUrl}/ai/conversation/clear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ projectId, userId }),
            });
            setMessages([]);
        } catch (e) {
            console.error('Failed to clear history');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        AI Document Search
                    </h3>
                    <p className="text-sm text-gray-500">
                        Ask technical questions about your project
                    </p>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        className="text-sm text-gray-400 hover:text-gray-600"
                    >
                        Clear history
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📚</div>
                        <p className="text-gray-500 mb-4">
                            Ask specific technical questions and get answers with citations.
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={() => setInput('What is the concrete specification for the foundation?')}
                                className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                            >
                                💡 "What is the concrete specification for the foundation?"
                            </button>
                            <button
                                onClick={() => setInput('Show me the steel requirements for Column C1')}
                                className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                            >
                                💡 "Show me the steel requirements for Column C1"
                            </button>
                        </div>
                    </div>
                )}

                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] rounded-xl px-4 py-3 ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>

                            {message.isStreaming && (
                                <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                            )}

                            {/* Confidence Badge */}
                            {message.role === 'assistant' && message.confidence && !message.isStreaming && (
                                <div className="mt-2">
                                    <ConfidenceBadge level={message.confidence} />
                                </div>
                            )}

                            {/* Enhanced Citations with Page Numbers */}
                            {message.citations && message.citations.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">📄 Sources:</p>
                                    <div className="space-y-2">
                                        {message.citations.map((citation, i) => (
                                            <button
                                                key={i}
                                                onClick={() => onViewFile?.(citation.fileId, citation.pageNumber)}
                                                className="block w-full text-left bg-white rounded-lg p-2 hover:bg-gray-50 border border-gray-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {citation.fileName}
                                                    </span>
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                        Page {citation.pageNumber}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {citation.snippet}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a specific question about your documents..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '...' : '→'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatPanel;
