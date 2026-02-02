import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DailyLogService } from './daily-log.service';

@Controller('construction/daily-log')
@UseGuards(JwtAuthGuard)
export class DailyLogController {
    constructor(private readonly dailyLogService: DailyLogService) { }

    @Get(':projectId')
    async getDailyLog(
        @Param('projectId') projectId: string,
        @Query('date') dateStr?: string
    ) {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.logWithMockWeather(projectId, date);
    }

    private async logWithMockWeather(projectId: string, date: Date) {
        const log = await this.dailyLogService.getDailyLog(projectId, date);
        
        // Mock weather if not set (Simulating external API call)
        if (log.report && !log.report.weatherCondition) {
            log.report.weatherCondition = 'Partly Cloudy';
            log.report.temperature = 31.5;
            log.report.humidity = 75;
        }

        return log;
    }
}
