import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RedactionService, CreateRedactionDto } from './redaction.service';

@Controller('security/redaction')
@UseGuards(JwtAuthGuard)
export class RedactionController {
    constructor(private readonly redactionService: RedactionService) { }

    @Post()
    async create(@Body() dto: CreateRedactionDto, @CurrentUser() user: any) {
        return this.redactionService.createRedaction(dto, user.id);
    }

    @Get('file/:fileId')
    async getForFile(@Param('fileId') fileId: string) {
        return this.redactionService.getRedactions(fileId);
    }

    @Get('viewer-config/:fileId')
    async getViewerConfig(@Param('fileId') fileId: string) {
        return this.redactionService.getViewerRedactionConfig(fileId);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.redactionService.deleteRedaction(id);
    }
}
