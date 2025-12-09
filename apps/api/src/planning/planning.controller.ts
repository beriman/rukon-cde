import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from '../common/services/export.service';
import { PlanningService } from './planning.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { TemplateType } from '@prisma/client';
// Assuming JwtAuthGuard exists from Epic 1
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('planning')
export class PlanningController {
    constructor(
        private readonly planningService: PlanningService,
        private readonly exportService: ExportService
    ) { }

    @Get('templates')
    findAllTemplates(
        @Query('type') type?: TemplateType,
        @Query('orgId') orgId?: string,
    ) {
        return this.planningService.findAllTemplates(type, orgId);
    }

    @Get(':id/export/pdf')
    async exportPdf(@Param('id') id: string, @Res() res: Response) {
        const document = await this.planningService.findOneDocument(id);
        const buffer = await this.exportService.generatePdf({
            content: [
                { text: document.title, style: 'header' },
                { text: `Type: ${document.type}` },
                { text: JSON.stringify(document.content, null, 2), style: 'code' }
            ],
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                code: { font: 'Courier', fontSize: 10 }
            }
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${document.title}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.send(buffer);
    }

    @Get(':id/export/xlsx')
    async exportExcel(@Param('id') id: string, @Res() res: Response) {
        // Mock data extraction for Excel
        const document = await this.planningService.findOneDocument(id);
        const data = [{
            id: document.id,
            title: document.title,
            type: document.type,
            status: document.status
        }];

        const buffer = await this.exportService.generateExcel(data, 'Document Info');

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${document.title}.xlsx"`,
            'Content-Length': buffer.length,
        });
        res.send(buffer);
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
