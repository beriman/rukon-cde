import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/inspection.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class InspectionsController {
    constructor(private readonly inspectionsService: InspectionsService) { }

    @Post('projects/:projectId/inspections')
    create(
        @Param('projectId') projectId: string,
        @Body() dto: CreateInspectionDto,
        @Request() req,
    ) {
        return this.inspectionsService.create(projectId, req.user.userId, dto);
    }

    @Get('projects/:projectId/inspections')
    findAll(
        @Param('projectId') projectId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.inspectionsService.findAll(projectId, page, limit);
    }
}
