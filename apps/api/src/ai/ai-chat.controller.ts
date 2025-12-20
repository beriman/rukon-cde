import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    UseGuards,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiChatService } from './ai-chat.service';
import { IngestionService } from './ingestion.service';

class ChatDto {
    projectId: string;
    query: string;
}

class IngestDto {
    fileId: string;
    projectId: string;
    content: string;
    fileName: string;
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiChatController {
    constructor(
        private readonly chatService: AiChatService,
        private readonly ingestionService: IngestionService,
    ) { }

    /**
     * Chat with documents - non-streaming
     */
    @Post('chat')
    async chat(@Body() dto: ChatDto) {
        return this.chatService.chat(dto.projectId, dto.query);
    }

    /**
     * Chat with documents - SSE streaming
     */
    @Post('chat/stream')
    async chatStream(@Body() dto: ChatDto, @Res() res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            for await (const chunk of this.chatService.streamChat(dto.projectId, dto.query)) {
                res.write(`data: ${chunk}\n\n`);
            }
        } catch (error: any) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
        }

        res.end();
    }

    /**
     * Search documents without generating answer
     */
    @Get('search')
    async search(
        @Query('projectId') projectId: string,
        @Query('query') query: string,
        @Query('limit') limit?: string,
    ) {
        const topK = limit ? parseInt(limit, 10) : 5;
        return this.chatService.searchDocuments(projectId, query, topK);
    }

    /**
     * Ingest a document for RAG
     */
    @Post('ingest')
    async ingest(@Body() dto: IngestDto) {
        const chunksCreated = await this.ingestionService.ingestDocument(
            dto.fileId,
            dto.projectId,
            dto.content,
            dto.fileName,
        );

        return {
            success: true,
            chunksCreated,
            message: `Indexed ${chunksCreated} chunks from ${dto.fileName}`,
        };
    }

    /**
     * Delete document from index
     */
    @Post('ingest/:fileId/delete')
    async deleteFromIndex(@Param('fileId') fileId: string) {
        await this.ingestionService.deleteDocumentChunks(fileId);
        return { success: true, message: 'Document removed from index' };
    }

    /**
     * Get project ingestion stats
     */
    @Get('stats/:projectId')
    async getStats(@Param('projectId') projectId: string) {
        return this.ingestionService.getProjectIngestionStats(projectId);
    }
}
