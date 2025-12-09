import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto, UpdateIncidentDto, CreateActionDto } from './dto/incident.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) { }

    @Post('projects/:projectId/incidents')
    create(
        @Param('projectId') projectId: string,
        @Body() dto: CreateIncidentDto,
        @Request() req,
    ) {
        return this.incidentsService.create(projectId, req.user.userId, dto);
    }

    @Get('projects/:projectId/incidents')
    findAll(@Param('projectId') projectId: string) {
        return this.incidentsService.findAll(projectId);
    }

    @Get('incidents/:id')
    findOne(@Param('id') id: string) {
        return this.incidentsService.findOne(id);
    }

    @Patch('incidents/:id')
    update(@Param('id') id: string, @Body() dto: UpdateIncidentDto) {
        return this.incidentsService.update(id, dto);
    }

    @Post('incidents/:id/actions')
    addAction(@Param('id') id: string, @Body() dto: CreateActionDto) {
        return this.incidentsService.addAction(id, dto);
    }

    @Patch('incidents/actions/:actionId')
    updateAction(
        @Param('actionId') actionId: string,
        @Body('status') status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED',
    ) {
        return this.incidentsService.updateAction(actionId, status);
    }
}
