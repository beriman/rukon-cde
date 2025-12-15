import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { CostService } from './cost.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects/:projectId/cost')
@UseGuards(JwtAuthGuard)
export class CostController {
    constructor(private readonly costService: CostService) { }

    @Post('boq')
    createBoq(
        @Param('projectId') projectId: string,
        @Body() body: { name: string; description?: string; currency?: string },
    ) {
        return this.costService.createBoq(projectId, body.name, body.description, body.currency);
    }

    @Get('boq')
    getBoqs(@Param('projectId') projectId: string) {
        return this.costService.getBoqs(projectId);
    }

    @Post('boq/:boqId/items')
    createItem(
        @Param('boqId') boqId: string,
        @Body() body: any,
    ) {
        return this.costService.createBoqItem(boqId, body);
    }

    @Get('boq/:boqId/items')
    getItems(@Param('boqId') boqId: string) {
        return this.costService.getBoqItems(boqId);
    }

    @Post('map')
    mapItem(
        @Body() body: { boqItemId: string; elementGuid: string; modelId: string },
    ) {
        return this.costService.mapCostToElement(body.boqItemId, body.elementGuid, body.modelId);
    }

    @Get('mappings')
    getMappings(@Param('projectId') projectId: string) {
        return this.costService.getProjectCostMappings(projectId);
    }
}
