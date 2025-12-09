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
import { MIDPService } from './midp.service';
import { BEPService } from './bep.service';

@Module({
    imports: [PrismaModule],
    controllers: [PlanningController, TaskDeliveryController, WorkflowsController],
    providers: [
        PlanningService,
        ExportService,
        TaskDeliveryService,
        WorkflowsService,
        ValidationService,
        CollaborationGateway,
        MIDPService,
        BEPService
    ],
    exports: [
        PlanningService,
        TaskDeliveryService,
        WorkflowsService,
        ValidationService,
        MIDPService,
        BEPService
    ],
})
export class PlanningModule { }
