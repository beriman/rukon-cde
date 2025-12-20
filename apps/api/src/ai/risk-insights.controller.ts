import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RiskInsightsService } from './risk-insights.service';

@Controller('ai/insights')
@UseGuards(JwtAuthGuard)
export class RiskInsightsController {
    constructor(private readonly riskInsightsService: RiskInsightsService) { }

    /**
     * Get daily risk insights for a project
     */
    @Get(':projectId')
    async getDailyInsights(@Param('projectId') projectId: string) {
        return this.riskInsightsService.generateDailyInsights(projectId);
    }
}
