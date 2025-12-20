import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';
import { ConversationService } from './conversation.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SearchResult {
    id: string;
    fileId: string;
    content: string;
    fileName: string;
    pageNumber: number;
    similarity: number;
}

interface Citation {
    fileId: string;
    fileName: string;
    pageNumber: number;
    snippet: string;
}

interface ChatResponse {
    answer: string;
    citations: Citation[];
    confidence: 'high' | 'medium' | 'low';
}

// Factual extraction prompt designed to minimize hallucinations
const FACTUAL_PROMPT = `You are a construction project document assistant. Your job is to answer questions ONLY using the provided document context.

CRITICAL RULES:
1. ONLY answer from the provided context - never make up information
2. Quote exact text when citing specifications or numbers
3. Always cite sources as [Source X, Page Y]
4. If the context doesn't contain the answer, say: "I couldn't find definitive information about this in the indexed documents."
5. Never invent specifications, measurements, or technical details
6. If partially confident, say: "Based on the available documents, it appears that..." 

{conversationContext}

DOCUMENT CONTEXT:
{context}

USER QUESTION: {query}

Provide a direct, factual answer with citations:`;

@Injectable()
export class AiChatService {
    private genAI: GoogleGenerativeAI;
    private chatModel: any;

    constructor(
        private readonly prisma: PrismaService,
        private readonly embeddingService: EmbeddingService,
        private readonly conversationService: ConversationService,
    ) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.chatModel = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash'
            });
        }
    }

    /**
     * Search for relevant document chunks with page info
     */
    async searchDocuments(
        projectId: string,
        query: string,
        topK: number = 5,
    ): Promise<SearchResult[]> {
        const queryEmbedding = await this.embeddingService.generateEmbedding(query);
        const embeddingStr = this.embeddingService.formatForPgVector(queryEmbedding);

        const results = await this.prisma.$queryRaw<any[]>`
      SELECT 
        dc.id,
        dc.file_id as "fileId",
        dc.content,
        dc.metadata->>'fileName' as "fileName",
        COALESCE((dc.metadata->>'pageNumber')::int, 1) as "pageNumber",
        1 - (dc.embedding <=> ${embeddingStr}::vector) as similarity
      FROM document_chunks dc
      WHERE dc.project_id = ${projectId}::uuid
      ORDER BY dc.embedding <=> ${embeddingStr}::vector
      LIMIT ${topK}
    `;

        return results;
    }

    /**
     * Determine confidence level based on search results
     */
    private assessConfidence(results: SearchResult[]): 'high' | 'medium' | 'low' {
        if (results.length === 0) return 'low';

        const avgSimilarity = results.reduce((sum, r) => sum + r.similarity, 0) / results.length;
        const topSimilarity = results[0]?.similarity || 0;

        if (topSimilarity > 0.8 && avgSimilarity > 0.6) return 'high';
        if (topSimilarity > 0.5 && avgSimilarity > 0.4) return 'medium';
        return 'low';
    }

    /**
     * Chat with documents - Enhanced RAG with citations
     */
    async chat(
        projectId: string,
        query: string,
        userId?: string,
    ): Promise<ChatResponse> {
        if (!this.chatModel) {
            throw new Error('AI service not initialized');
        }

        // Search for relevant chunks
        const searchResults = await this.searchDocuments(projectId, query, 5);
        const confidence = this.assessConfidence(searchResults);

        if (searchResults.length === 0) {
            return {
                answer: "I couldn't find any relevant documents matching your query. Please try rephrasing or check if the documents have been indexed.",
                citations: [],
                confidence: 'low',
            };
        }

        // Build context with source numbers and page info
        const context = searchResults
            .map((r, i) => `[Source ${i + 1}: ${r.fileName}, Page ${r.pageNumber}]\n${r.content}`)
            .join('\n\n---\n\n');

        // Get conversation history if userId provided
        let conversationContext = '';
        if (userId) {
            conversationContext = this.conversationService.formatForPrompt(userId, projectId);
        }

        // Build prompt
        const prompt = FACTUAL_PROMPT
            .replace('{conversationContext}', conversationContext ? `\nCONVERSATION HISTORY:\n${conversationContext}\n` : '')
            .replace('{context}', context)
            .replace('{query}', query);

        // Generate response
        const result = await this.chatModel.generateContent(prompt);
        const answer = result.response.text();

        // Store in conversation history
        if (userId) {
            this.conversationService.addMessage(userId, projectId, 'user', query);
            this.conversationService.addMessage(userId, projectId, 'assistant', answer);
        }

        // Format citations with page numbers
        const citations: Citation[] = searchResults.map(r => ({
            fileId: r.fileId,
            fileName: r.fileName,
            pageNumber: r.pageNumber,
            snippet: r.content.substring(0, 150) + '...',
        }));

        return { answer, citations, confidence };
    }

    /**
     * Stream chat response with enhanced citations
     */
    async *streamChat(
        projectId: string,
        query: string,
        userId?: string,
    ): AsyncGenerator<string> {
        if (!this.chatModel) {
            yield JSON.stringify({ error: 'AI service not initialized' });
            return;
        }

        const searchResults = await this.searchDocuments(projectId, query, 5);
        const confidence = this.assessConfidence(searchResults);

        if (searchResults.length === 0) {
            yield JSON.stringify({
                type: 'answer',
                content: "I couldn't find any relevant documents matching your query.",
                confidence: 'low',
            });
            yield JSON.stringify({ type: 'done', citations: [] });
            return;
        }

        // Send citations first with page numbers
        const citations: Citation[] = searchResults.map(r => ({
            fileId: r.fileId,
            fileName: r.fileName,
            pageNumber: r.pageNumber,
            snippet: r.content.substring(0, 150) + '...',
        }));
        yield JSON.stringify({ type: 'citations', citations, confidence });

        // Build context and prompt
        const context = searchResults
            .map((r, i) => `[Source ${i + 1}: ${r.fileName}, Page ${r.pageNumber}]\n${r.content}`)
            .join('\n\n---\n\n');

        let conversationContext = '';
        if (userId) {
            conversationContext = this.conversationService.formatForPrompt(userId, projectId);
        }

        const prompt = FACTUAL_PROMPT
            .replace('{conversationContext}', conversationContext ? `\nCONVERSATION HISTORY:\n${conversationContext}\n` : '')
            .replace('{context}', context)
            .replace('{query}', query);

        // Stream response
        const result = await this.chatModel.generateContentStream(prompt);
        let fullResponse = '';

        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                fullResponse += text;
                yield JSON.stringify({ type: 'chunk', content: text });
            }
        }

        // Store conversation
        if (userId) {
            this.conversationService.addMessage(userId, projectId, 'user', query);
            this.conversationService.addMessage(userId, projectId, 'assistant', fullResponse);
        }

        yield JSON.stringify({ type: 'done' });
    }

    /**
     * Clear conversation history
     */
    clearConversation(userId: string, projectId: string): void {
        this.conversationService.clearConversation(userId, projectId);
    }
}
