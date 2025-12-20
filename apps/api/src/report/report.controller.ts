import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportService, GenerateReportDto } from './report.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    /**
     * Generate a new report
     */
    @Post('generate')
    async generate(@Body() dto: GenerateReportDto) {
        return this.reportService.generateReport(dto);
    }

    /**
     * Preview report data without saving
     */
    @Post('preview')
    async preview(@Body() dto: GenerateReportDto) {
        return this.reportService.previewReport(dto);
    }

    /**
     * List reports for a project
     */
    @Get()
    async list(@Query('projectId') projectId: string) {
        return this.reportService.listReports(projectId);
    }

    /**
     * Get a specific report
     */
    @Get(':id')
    async get(@Param('id') id: string) {
        return this.reportService.getReport(id);
    }

    // ===== TEMPLATES =====

    @Get('templates')
    async listTemplates(@Query('projectId') projectId: string) {
        return this.reportService.listTemplates(projectId);
    }

    @Post('templates')
    async createTemplate(@Body() data: {
        name: string;
        projectId?: string;
        sections: string[];
        branding?: object;
    }) {
        return this.reportService.createTemplate(data);
    }

    @Put('templates/:id')
    async updateTemplate(
        @Param('id') id: string,
        @Body() data: { name?: string; sections?: string[]; branding?: object },
    ) {
        return this.reportService.updateTemplate(id, data);
    }

    @Delete('templates/:id')
    async deleteTemplate(@Param('id') id: string) {
        return this.reportService.deleteTemplate(id);
    }
}
