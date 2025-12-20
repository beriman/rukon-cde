import { Module } from '@nestjs/common';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';
import { IngestionService } from './ingestion.service';
import { EmbeddingService } from './embedding.service';
import { ConversationService } from './conversation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AiChatController],
    providers: [AiChatService, IngestionService, EmbeddingService, ConversationService],
    exports: [AiChatService, IngestionService],
})
export class AiModule { }
