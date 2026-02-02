import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VariationService } from './variation.service';

@Controller('construction/variations')
@UseGuards(JwtAuthGuard)
export class VariationController {
    constructor(private readonly variationService: VariationService) { }

    @Get(':projectId')
    async getVOs(@Param('projectId') projectId: string) {
        return this.variationService.getProjectVOs(projectId);
    }

    @Post()
    async createVO(@Body() body: any) {
        return this.variationService.createVO(body);
    }
}
