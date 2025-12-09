import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request, Patch } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('planning/workflows')
export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) { }

    @Post()
    // @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateWorkflowDto, @Query('projectId') projectId: string) {
        return this.workflowsService.create(projectId, dto);
    }

    @Get()
    findAll(@Query('projectId') projectId: string) {
        return this.workflowsService.findAll(projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.workflowsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.workflowsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.workflowsService.delete(id);
    }

    @Post(':id/trigger')
    trigger(@Param('id') id: string, @Body('fileId') fileId: string, @Request() req) {
        // Mock user id
        const userId = req?.user?.userId || 'system';
        return this.workflowsService.triggerWorkflow(fileId, id, userId);
    }
}
