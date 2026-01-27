import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HseService } from './hse.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class HseController {
    constructor(private readonly hseService: HseService) { }

    @Get('projects/:projectId/hse/stats')
    getStats(@Param('projectId') projectId: string) {
        return this.hseService.getStats(projectId);
    }

    @Get('projects/:projectId/hse/stats/trends')
    getStatsWithTrends(@Param('projectId') projectId: string) {
        return this.hseService.getStatsWithTrends(projectId);
    }

    @Get('projects/:projectId/hse/dashboard')
    getDashboard(@Param('projectId') projectId: string) {
        return this.hseService.getComprehensiveDashboard(projectId);
    }
}
