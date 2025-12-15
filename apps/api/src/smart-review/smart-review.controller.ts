import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SmartReviewService } from './smart-review.service';
import { CreateValidationRuleDto, CreateValidationReportDto } from './dto/create-smart-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('smart-review')
@UseGuards(JwtAuthGuard)
export class SmartReviewController {
    constructor(private readonly smartReviewService: SmartReviewService) { }

    @Post('rules')
    createRule(@Body() dto: CreateValidationRuleDto) {
        return this.smartReviewService.createRule(dto);
    }

    @Get('rules')
    getRules() {
        return this.smartReviewService.getRules();
    }

    @Post('reports')
    createReport(@Body() dto: CreateValidationReportDto) {
        return this.smartReviewService.createReport(dto);
    }

    @Get('reports/:projectId')
    getReports(
        @Param('projectId') projectId: string,
        @Query('modelId') modelId?: string
    ) {
        return this.smartReviewService.getReports(projectId, modelId);
    }
}
