import { Controller, Get, Post, Body, Param, Patch, Delete, Query, Request, Res, UseGuards } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { ExportService } from './export.service';
import { AuditService } from './audit.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { TemplateType } from '@prisma/client';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('planning')
export class PlanningController {
    constructor(
        private readonly planningService: PlanningService,
        private readonly exportService: ExportService,
        private readonly auditService: AuditService
    ) { }

    @Get('templates')
    findAllTemplates(
        @Query('type') type?: TemplateType,
        @Query('orgId') orgId?: string,
    ) {
        return this.planningService.findAllTemplates(type, orgId);
    }

    @Post('documents')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
        // Get authenticated user ID
        const userId = req.user?.id || 'system-test-user';
        const document = await this.planningService.createDocument(userId, createDocumentDto);

        // Audit log
        await this.auditService.logDocumentCreate(userId, document.id, document, req);

        return document;
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
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.planningService.findAllDocuments(orgId, projectId, type, pageNum, limitNum);
    }

    @Get('documents/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Request() req) {
        const document = await this.planningService.findOneDocument(id);

        // Audit log view
        const userId = req.user?.id || 'system-viewer';
        await this.auditService.logDocumentView(userId, id, req);

        return document;
    }

    @Patch('documents/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @Request() req) {
        const userId = req.user?.id || 'system-test-user';
        const document = await this.planningService.updateDocument(id, updateDocumentDto);

        // Audit log changes
        await this.auditService.logDocumentUpdate(userId, id, updateDocumentDto, req);

        return document;
    }

    @Get('documents/:id/export/pdf')
    async exportPDF(@Param('id') id: string, @Res() res: Response) {
        const document = await this.planningService.findOneDocument(id);
        const pdfBuffer = await this.exportService.generatePDF(document);

        res.set({
            'Content-Type': this.exportService.getContentType('pdf'),
            'Content-Disposition': `attachment; filename="${this.exportService.getFilename(document, 'pdf')}"`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    }

    @Get('documents/:id/export/docx')
    async exportDOCX(@Param('id') id: string, @Res() res: Response) {
        const document = await this.planningService.findOneDocument(id);
        const docxBuffer = await this.exportService.generateDOCX(document);

        res.set({
            'Content-Type': this.exportService.getContentType('docx'),
            'Content-Disposition': `attachment; filename="${this.exportService.getFilename(document, 'docx')}"`,
            'Content-Length': docxBuffer.length
        });

        res.send(docxBuffer);
    }

    @Delete('documents/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string, @Request() req) {
        const userId = req.user?.id || 'system-test-user';
        const result = await this.planningService.deleteDocument(id);

        // Audit log deletion
        await this.auditService.logDocumentDelete(userId, id, req);

        return result;
    }
}
