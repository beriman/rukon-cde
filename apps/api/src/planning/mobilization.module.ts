import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MobilizationController } from './mobilization.controller';
import { ChecklistService } from './checklist.service';

@Module({
    imports: [PrismaModule],
    controllers: [MobilizationController],
    providers: [ChecklistService],
    exports: [ChecklistService],
})
export class MobilizationModule { }
