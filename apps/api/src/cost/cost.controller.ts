import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CostService } from './cost.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

    @Get('boq/:boqId')
    getBoqDetails(@Param('boqId') boqId: string) {
        return this.costService.getBoqDetails(boqId);
    }

    @Post('boq/upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadBoq(
        @Param('projectId') projectId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { name: string },
    ) {
        return this.costService.importBoq(projectId, body.name, file.buffer);
    }
}
