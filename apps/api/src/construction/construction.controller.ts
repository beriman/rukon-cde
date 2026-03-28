import { Body, Controller, Get, Param, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming this exists
import { Discipline } from '@prisma/client';

// Simple DTOs
export class CreateWorkPackageDto {
    projectId: string;
    name: string;
    discipline: Discipline;
    weight?: number;
}

export class CreateProgressUpdateDto {
    workPackageId: string;
    date: string; // ISO Date
    percentage: number;
    notes?: string;
    photos?: string[];
}

@Controller('construction')
@UseGuards(JwtAuthGuard)
export class ConstructionController {
    constructor(private readonly progressService: ProgressService) { }

    @Post('work-packages')
    async createWorkPackage(@Body() dto: CreateWorkPackageDto) {
        return this.progressService.createWorkPackage(dto);
    }

    @Post('progress')
    async recordProgress(@Body() dto: CreateProgressUpdateDto, @Request() req) {
        // Mock user ID if auth not fully set up or for dev
        const userId = req.user?.id || 'user-uuid-placeholder';

        return this.progressService.recordProgress({
            ...dto,
            date: new Date(dto.date),
            submittedBy: userId,
        });
    }

    @Get('project/:projectId/progress')
    async getProjectProgress(
        @Param('projectId') projectId: string,
        @Query('discipline') discipline?: Discipline,
    ) {
        return this.progressService.getProjectProgress(projectId, discipline);
    }

    @Get('work-packages/:id/history')
    async getPackageHistory(@Param('id') id: string) {
        return this.progressService.getPackageHistory(id);
    }
}
