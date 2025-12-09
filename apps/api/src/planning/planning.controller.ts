import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { TemplateType } from '@prisma/client';
// Assuming JwtAuthGuard exists from Epic 1
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('planning')
export class PlanningController {
    constructor(private readonly planningService: PlanningService) { }

    @Get('templates')
    findAllTemplates(
        @Query('type') type?: TemplateType,
        @Query('orgId') orgId?: string,
    ) {
        return this.planningService.findAllTemplates(type, orgId);
    }

    @Post('documents')
    // @UseGuards(JwtAuthGuard)
    create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
        // Mock user ID if auth not fully integrated in this session context, or assume req.user.id
        const userId = req.user?.id || 'system-test-user';
        return this.planningService.createDocument(userId, createDocumentDto);
    }

    @Get('latest-oir')
    getLatestOIR(@Query('orgId') orgId: string) {
        return this.planningService.findLatestOIR(orgId);
    }

    @Get('documents')
    findAllDocuments(
        @Query('orgId') orgId: string,
        @Query('projectId') projectId?: string,
        @Query('type') type?: TemplateType,
    ) {
        return this.planningService.findAllDocuments(orgId, projectId, type);
    }

    @Get('documents/:id')
    findOne(@Param('id') id: string) {
        return this.planningService.findOneDocument(id);
    }

    @Patch('documents/:id')
    update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        return this.planningService.updateDocument(id, updateDocumentDto);
    }

    @Delete('documents/:id')
    remove(@Param('id') id: string) {
        return this.planningService.deleteDocument(id);
    }
}
