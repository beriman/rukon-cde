import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DesignService } from './design.service';

@Controller('design')
export class DesignController {
    constructor(private readonly designService: DesignService) { }

    @Get('workspaces/:projectId')
    async getWorkspaces(@Param('projectId') projectId: string) {
        return this.designService.getWorkspaces(projectId);
    }

    @Post('references')
    async createReference(@Body() body: { sourceFileId: string; targetFolderId: string }) {
        return this.designService.createReference(body.sourceFileId, body.targetFolderId);
    }

    @Get('markups/:fileId')
    async getMarkups(@Param('fileId') fileId: string) {
        return this.designService.getMarkups(fileId);
    }
}
