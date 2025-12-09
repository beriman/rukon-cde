import { Module } from '@nestjs/common';
import { DesignService } from './design.service';
import { DesignController } from './design.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [DesignController],
    providers: [DesignService, PrismaService],
    exports: [DesignService],
})
export class DesignModule { }
