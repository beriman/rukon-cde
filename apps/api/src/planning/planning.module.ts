import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ExportService } from '../common/services/export.service';

import { TaskDeliveryService } from './task-delivery.service';
import { TaskDeliveryController } from './task-delivery.controller';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { ValidationService } from './validation.service';
import { CollaborationGateway } from './collaboration.gateway';

@Module({
    imports: [PrismaModule],
    controllers: [PlanningController, TaskDeliveryController, WorkflowsController],
    providers: [
        PlanningService,
        ExportService,
        TaskDeliveryService,
        WorkflowsService,
        ValidationService,
        CollaborationGateway
    ],
    exports: [
        PlanningService,
        TaskDeliveryService,
        WorkflowsService,
        ValidationService
    ],
})
export class PlanningModule { }
