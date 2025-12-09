import { Controller, Patch, Param, Body, Get, Query, UseGuards } from '@nestjs/common';
import { TaskDeliveryService } from './task-delivery.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('planning/tasks')
export class TaskDeliveryController {
    constructor(private readonly taskDeliveryService: TaskDeliveryService) { }

    @Get()
    findByProject(@Query('projectId') projectId: string) {
        return this.taskDeliveryService.findByProject(projectId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: { startDate?: string; endDate?: string; status?: string; assignedTo?: string }
    ) {
        // Convert strings to Dates if present
        const data = {
            ...body,
            startDate: body.startDate ? new Date(body.startDate) : undefined,
            endDate: body.endDate ? new Date(body.endDate) : undefined,
        };
        return this.taskDeliveryService.updateDeliverable(id, data);
    }
}
