import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DesignService } from './design.service';

@Controller('design')
export class DesignController {
    constructor(private readonly designService: DesignService) { }

    @Get('workspaces/:projectId')
    async getWorkspaces(@Param('projectId') projectId: string) {
        return this.designService.getWorkspaces(projectId);
    }

    @Post('workspaces/init/:projectId')
    async initWorkspaces(@Param('projectId') projectId: string) {
        return this.designService.initializeWorkspaces(projectId);
    }

    @Get('markups/:fileId')
    async getMarkups(@Param('fileId') fileId: string) {
        return this.designService.getMarkups(fileId);
    }

    @Post('markups')
    async createMarkup(@Body() body: { fileId: string; authorId: string; layerData: any }) {
        // In real app, authorId comes from JWT @Request
        return this.designService.createMarkup(body.fileId, body.authorId, body.layerData);
    }
}
