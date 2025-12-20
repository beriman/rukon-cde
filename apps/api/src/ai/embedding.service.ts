import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class EmbeddingService {
    private genAI: GoogleGenerativeAI;
    private embeddingModel: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not set - embedding service disabled');
            return;
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.embeddingModel = this.genAI.getGenerativeModel({
            model: 'text-embedding-004'
        });
    }

    /**
     * Generate embedding for text using Gemini
     * Returns 768-dimensional vector
     */
    async generateEmbedding(text: string): Promise<number[]> {
        if (!this.embeddingModel) {
            throw new Error('Embedding service not initialized');
        }

        try {
            const result = await this.embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch (error: any) {
            console.error('Embedding error:', error.message);
            throw new Error('Failed to generate embedding');
        }
    }

    /**
     * Generate embeddings for multiple texts (batch)
     */
    async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
        const embeddings: number[][] = [];

        for (const text of texts) {
            const embedding = await this.generateEmbedding(text);
            embeddings.push(embedding);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return embeddings;
    }

    /**
     * Format embedding array for pgvector storage
     */
    formatForPgVector(embedding: number[]): string {
        return `[${embedding.join(',')}]`;
    }
}
