import { Injectable } from '@nestjs/common';
import PdfPrinter = require('pdfmake');
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { TemplateType, DocumentStatus } from '@prisma/client';

@Injectable()
export class ExportService {
    private fonts = {
        Roboto: {
            normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
            bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
            italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
            bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
        }
    };

    /**
     * Generate PDF from planning document
     */
    async generatePDF(document: any): Promise<Buffer> {
        const printer = new PdfPrinter(this.fonts);

        const docDefinition: TDocumentDefinitions = {
            content: this.buildPDFContent(document),
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    marginBottom: 10
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    marginTop: 15,
                    marginBottom: 5
                },
                sectionTitle: {
                    fontSize: 14,
                    bold: true,
                    marginTop: 10,
                    marginBottom: 5
                },
                helpText: {
                    fontSize: 10,
                    italics: true,
                    color: '#666666',
                    marginBottom: 5
                },
                content: {
                    fontSize: 11,
                    marginBottom: 10
                },
                footer: {
                    fontSize: 9,
                    color: '#999999'
                }
            },
            pageMargins: [60, 80, 60, 60],
            header: (currentPage, pageCount) => {
                return {
                    text: `${document.title} - ISO 19650 Document`,
                    alignment: 'center',
                    fontSize: 10,
                    margin: [0, 20, 0, 0],
                    color: '#666666'
                };
            },
            footer: (currentPage, pageCount) => {
                return {
                    columns: [
                        { text: `Status: ${document.status}`, fontSize: 9, color: '#999', margin: [60, 10, 0, 0] },
                        { text: `Version: ${document.version}`, fontSize: 9, color: '#999', margin: [0, 10, 0, 0], alignment: 'center' },
                        { text: `Page ${currentPage} of ${pageCount}`, fontSize: 9, color: '#999', margin: [0, 10, 60, 0], alignment: 'right' }
                    ]
                };
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            pdfDoc.on('data', (chunk) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });
    }

    /**
     * Build PDF content from document structure
     */
    private buildPDFContent(document: any): Content {
        const content: Content = [];

        // Title
        content.push({
            text: document.title,
            style: 'header',
            marginBottom: 20
        });

        // Metadata
        content.push({
            columns: [
                { text: `Type: ${document.type}`, fontSize: 10 },
                { text: `Status: ${document.status}`, fontSize: 10 },
                { text: `Version: ${document.version}`, fontSize: 10 }
            ],
            marginBottom: 20
        });

        // Separator
        content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
            marginBottom: 20
        });

        // Document-specific content based on type
        if (document.content && document.content.sections) {
            document.content.sections.forEach((section: any) => {
                // Section title
                content.push({
                    text: section.title || section.id,
                    style: 'sectionTitle'
                });

                // Help text (if exists)
                if (section.helpText) {
                    content.push({
                        text: section.helpText,
                        style: 'helpText'
                    });
                }

                // Section content
                if (section.content) {
                    content.push({
                        text: typeof section.content === 'string'
                            ? section.content
                            : JSON.stringify(section.content, null, 2),
                        style: 'content'
                    });
                } else if (section.defaultContent) {
                    content.push({
                        text: section.defaultContent,
                        style: 'content'
                    });
                }
            });
        }

        // Footer info
        content.push({
            text: '\n\n',
            pageBreak: 'after'
        });

        content.push({
            text: `Generated on: ${new Date().toLocaleString('id-ID')}`,
            style: 'footer',
            margin: [0, 20, 0, 0]
        });

        if (document.project) {
            content.push({
                text: `Project: ${document.project.name} (${document.project.code})`,
                style: 'footer'
            });
        }

        return content;
    }

    /**
     * Generate DOCX from planning document
     */
    async generateDOCX(document: any): Promise<Buffer> {
        const sections: any[] = [];

        // Title
        sections.push(
            new Paragraph({
                text: document.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 300 }
            })
        );

        // Metadata
        sections.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `Type: ${document.type} | `, bold: true }),
                    new TextRun({ text: `Status: ${document.status} | `, bold: true }),
                    new TextRun({ text: `Version: ${document.version}`, bold: true })
                ],
                spacing: { after: 400 }
            })
        );

        // Document content
        if (document.content && document.content.sections) {
            document.content.sections.forEach((section: any) => {
                // Section title
                sections.push(
                    new Paragraph({
                        text: section.title || section.id,
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 }
                    })
                );

                // Help text
                if (section.helpText) {
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: section.helpText, italics: true, color: '666666' })
                            ],
                            spacing: { after: 100 }
                        })
                    );
                }

                // Section content
                const contentText = section.content
                    ? (typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2))
                    : section.defaultContent || '';

                sections.push(
                    new Paragraph({
                        text: contentText,
                        spacing: { after: 200 }
                    })
                );
            });
        }

        // Footer info
        sections.push(
            new Paragraph({
                text: `Generated on: ${new Date().toLocaleString('id-ID')}`,
                spacing: { before: 400 },
                alignment: AlignmentType.RIGHT
            })
        );

        if (document.project) {
            sections.push(
                new Paragraph({
                    text: `Project: ${document.project.name} (${document.project.code})`,
                    alignment: AlignmentType.RIGHT
                })
            );
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: sections
            }]
        });

        return await Packer.toBuffer(doc);
    }

    /**
     * Get appropriate content type for export format
     */
    getContentType(format: 'pdf' | 'docx'): string {
        return format === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    /**
     * Get filename with appropriate extension
     */
    getFilename(document: any, format: 'pdf' | 'docx'): string {
        const sanitizedTitle = document.title.replace(/[^a-zA-Z0-9-_]/g, '_');
        const timestamp = new Date().toISOString().slice(0, 10);
        return `${sanitizedTitle}_v${document.version}_${timestamp}.${format}`;
    }
}
