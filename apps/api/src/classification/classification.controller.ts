import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ClassificationService, ClassificationCode } from './classification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AssignDto {
    projectId: string;
    elementGuid: string;
    code: ClassificationCode;
}

@Controller('classification')
@UseGuards(JwtAuthGuard)
export class ClassificationController {
    constructor(private readonly service: ClassificationService) { }

    @Get('search')
    search(@Query('q') query: string, @Query('system') system?: string) {
        return this.service.searchCodes(query, system);
    }

    @Post('assign')
    assign(@Body() dto: AssignDto) {
        return this.service.assignCode(dto.projectId, dto.elementGuid, dto.code);
    }

    @Get('project/:projectId')
    getProjectAssignments(@Param('projectId') projectId: string) {
        return this.service.getProjectAssignments(projectId);
    }
}
