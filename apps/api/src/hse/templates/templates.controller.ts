import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, CreateDrillDto } from '../dto/templates.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Post('inspections/templates')
    createTemplate(@Body() dto: CreateTemplateDto) {
        return this.templatesService.createTemplate(dto);
    }

    @Get('inspections/templates')
    getTemplates(@Query('projectId') projectId?: string) {
        return this.templatesService.getTemplates(projectId);
    }

    @Post('projects/:projectId/emergency/drills')
    createDrill(@Param('projectId') projectId: string, @Body() dto: CreateDrillDto) {
        return this.templatesService.createDrill(projectId, dto);
    }

    @Get('projects/:projectId/emergency/drills')
    getDrills(@Param('projectId') projectId: string) {
        return this.templatesService.getDrills(projectId);
    }
}
