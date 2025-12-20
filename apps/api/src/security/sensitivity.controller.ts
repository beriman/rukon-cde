import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SensitivityService, ClassifyDto } from './sensitivity.service';

@Controller('security/sensitivity')
@UseGuards(JwtAuthGuard)
export class SensitivityController {
    constructor(private readonly sensitivityService: SensitivityService) { }

    @Get('levels')
    getLevels() {
        return this.sensitivityService.getLevels();
    }

    @Post('classify')
    async classify(@Body() dto: ClassifyDto, @CurrentUser() user: any) {
        return this.sensitivityService.classifyFile(dto, user.id);
    }

    @Get('pending/:projectId')
    async getPending(@Param('projectId') projectId: string) {
        return this.sensitivityService.getPendingClassification(projectId);
    }
}
