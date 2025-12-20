import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ConversationContext {
    messages: ConversationMessage[];
    summary?: string;
}

@Injectable()
export class ConversationService {
    // In-memory store (production should use Redis/DB)
    private conversations = new Map<string, ConversationContext>();
    private readonly MAX_MESSAGES = 10;
    private readonly SUMMARY_THRESHOLD = 8;

    /**
     * Get conversation key
     */
    private getKey(userId: string, projectId: string): string {
        return `${userId}:${projectId}`;
    }

    /**
     * Get conversation context
     */
    getContext(userId: string, projectId: string): ConversationContext {
        const key = this.getKey(userId, projectId);
        return this.conversations.get(key) || { messages: [] };
    }

    /**
     * Add message to conversation
     */
    addMessage(
        userId: string,
        projectId: string,
        role: 'user' | 'assistant',
        content: string,
    ): void {
        const key = this.getKey(userId, projectId);
        const context = this.getContext(userId, projectId);

        context.messages.push({
            role,
            content,
            timestamp: new Date(),
        });

        // Trim old messages if exceeding limit
        if (context.messages.length > this.MAX_MESSAGES) {
            // Keep last N messages, summarize the rest
            const toSummarize = context.messages.slice(0, -this.MAX_MESSAGES);
            context.messages = context.messages.slice(-this.MAX_MESSAGES);

            // Create summary of older messages
            if (toSummarize.length > 0) {
                context.summary = this.createSummary(toSummarize, context.summary);
            }
        }

        this.conversations.set(key, context);
    }

    /**
     * Create summary of old messages
     */
    private createSummary(messages: ConversationMessage[], existingSummary?: string): string {
        const topics = messages
            .filter(m => m.role === 'user')
            .map(m => m.content.substring(0, 50))
            .join('; ');

        if (existingSummary) {
            return `${existingSummary} | Recent topics: ${topics}`;
        }
        return `Previous topics discussed: ${topics}`;
    }

    /**
     * Format context for LLM prompt
     */
    formatForPrompt(userId: string, projectId: string): string {
        const context = this.getContext(userId, projectId);

        let formatted = '';

        if (context.summary) {
            formatted += `[Previous conversation summary: ${context.summary}]\n\n`;
        }

        if (context.messages.length > 0) {
            formatted += 'Recent conversation:\n';
            for (const msg of context.messages.slice(-5)) {
                formatted += `${msg.role.toUpperCase()}: ${msg.content}\n`;
            }
        }

        return formatted;
    }

    /**
     * Clear conversation
     */
    clearConversation(userId: string, projectId: string): void {
        const key = this.getKey(userId, projectId);
        this.conversations.delete(key);
    }

    /**
     * Get conversation history for display
     */
    getHistory(userId: string, projectId: string): ConversationMessage[] {
        return this.getContext(userId, projectId).messages;
    }
}
