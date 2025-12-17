import { Module } from '@nestjs/common';
import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [ClassificationController],
    providers: [ClassificationService, PrismaService],
})
export class ClassificationModule { }
