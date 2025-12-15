import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { ExportService } from './export.service';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PlanningController],
    providers: [PlanningService, ExportService, AuditService],
    exports: [PlanningService, ExportService, AuditService],
})
export class PlanningModule { }
