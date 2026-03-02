import { Module } from '@nestjs/common';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';
import { IngestionService } from './ingestion.service';
import { EmbeddingService } from './embedding.service';
import { ConversationService } from './conversation.service';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AiChatController, PredictionController],
    providers: [AiChatService, IngestionService, EmbeddingService, ConversationService, PredictionService],
    exports: [AiChatService, IngestionService, PredictionService],
})
export class AiModule { }
