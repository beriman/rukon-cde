import { Module } from '@nestjs/common';
import { LoinController } from './loin.controller';
import { LoinService } from './loin.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [LoinController],
    providers: [LoinService, PrismaService],
    exports: [LoinService],
})
export class LoinModule { }
