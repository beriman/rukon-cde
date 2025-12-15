import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TaskDeliveryService } from './task-delivery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects/:projectId/schedule')
@UseGuards(JwtAuthGuard)
export class TaskDeliveryController {
    constructor(private readonly service: TaskDeliveryService) { }

    @Post('plans')
    createPlan(@Param('projectId') projectId: string, @Body() body: { name: string }) {
        return this.service.createPlan(projectId, body.name);
    }

    @Get('plans')
    getPlans(@Param('projectId') projectId: string) {
        return this.service.findAllPlans(projectId);
    }

    @Get('tasks')
    getAllTasks(@Param('projectId') projectId: string) {
        return this.service.getProjectTasks(projectId);
    }

    @Post('plans/:planId/tasks')
    createTask(@Param('planId') planId: string, @Body() body: any) {
        return this.service.createTask(planId, body);
    }

    @Put('tasks/:taskId')
    updateTask(@Param('taskId') taskId: string, @Body() body: any) {
        return this.service.updateTask(taskId, body);
    }

    @Delete('tasks/:taskId')
    deleteTask(@Param('taskId') taskId: string) {
        return this.service.deleteTask(taskId);
    }
}
