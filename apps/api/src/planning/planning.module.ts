import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { ExportService } from './export.service';
import { AuditService } from './audit.service';
import { TaskDeliveryService } from './task-delivery.service';
import { TaskDeliveryController } from './task-delivery.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PlanningController, TaskDeliveryController],
    providers: [PlanningService, ExportService, AuditService, TaskDeliveryService],
    exports: [PlanningService, ExportService, AuditService, TaskDeliveryService],
})
export class PlanningModule { }
