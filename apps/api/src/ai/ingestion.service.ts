import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';

interface ChunkWithMeta {
    text: string;
    pageNumber: number;
    charStart: number;
    charEnd: number;
}

@Injectable()
export class IngestionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly embeddingService: EmbeddingService,
    ) { }

    /**
     * Ingest a document: extract text, chunk, embed, store with page tracking
     */
    async ingestDocument(
        fileId: string,
        projectId: string,
        content: string,
        fileName: string,
    ): Promise<number> {
        // Chunk the content with page tracking
        const chunks = this.chunkTextWithPages(content, 500, 100);

        let insertedCount = 0;

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            try {
                // Generate embedding
                const embedding = await this.embeddingService.generateEmbedding(chunk.text);
                const embeddingStr = this.embeddingService.formatForPgVector(embedding);

                // Store in database with enhanced metadata
                await this.prisma.$executeRaw`
          INSERT INTO document_chunks (file_id, project_id, chunk_index, content, embedding, metadata)
          VALUES (
            ${fileId}::uuid, 
            ${projectId}::uuid, 
            ${i}, 
            ${chunk.text}, 
            ${embeddingStr}::vector,
            ${JSON.stringify({
                    fileName,
                    chunkIndex: i,
                    pageNumber: chunk.pageNumber,
                    charStart: chunk.charStart,
                    charEnd: chunk.charEnd
                })}::jsonb
          )
        `;

                insertedCount++;
            } catch (error: any) {
                console.error(`Failed to ingest chunk ${i}:`, error.message);
            }
        }

        return insertedCount;
    }

    /**
     * Chunk text with page number tracking for citations
     */
    chunkTextWithPages(text: string, chunkSize: number, overlap: number): ChunkWithMeta[] {
        const chunks: ChunkWithMeta[] = [];
        const pageBreaks = this.findPageBreaks(text);
        const words = text.split(/\s+/);

        let charIndex = 0;
        let i = 0;

        while (i < words.length) {
            const chunkWords = words.slice(i, i + chunkSize);
            const chunkText = chunkWords.join(' ').trim();

            if (chunkText) {
                const charStart = charIndex;
                const charEnd = charStart + chunkText.length;
                const pageNumber = this.getPageAtPosition(charStart, pageBreaks);

                chunks.push({ text: chunkText, pageNumber, charStart, charEnd });
            }

            charIndex += chunkWords.join(' ').length + 1;
            i += chunkSize - overlap;
        }

        return chunks;
    }

    /**
     * Find page break positions (form feed or "Page X" patterns)
     */
    private findPageBreaks(text: string): number[] {
        const breaks: number[] = [0];
        const pagePattern = /\f|(?:^|\n)(?:Page|PAGE)\s+\d+/g;
        let match;

        while ((match = pagePattern.exec(text)) !== null) {
            breaks.push(match.index);
        }

        return breaks;
    }

    /**
     * Get page number at a given character position
     */
    private getPageAtPosition(charPos: number, pageBreaks: number[]): number {
        for (let i = pageBreaks.length - 1; i >= 0; i--) {
            if (charPos >= pageBreaks[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    /**
     * Delete all chunks for a document
     */
    async deleteDocumentChunks(fileId: string): Promise<void> {
        await this.prisma.$executeRaw`
      DELETE FROM document_chunks WHERE file_id = ${fileId}::uuid
    `;
    }

    /**
     * Get ingestion status for a project
     */
    async getProjectIngestionStats(projectId: string) {
        const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        COUNT(DISTINCT file_id) as files_indexed,
        COUNT(*) as total_chunks
      FROM document_chunks 
      WHERE project_id = ${projectId}::uuid
    `;

        return result[0] || { files_indexed: 0, total_chunks: 0 };
    }
}
