import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PdfPrinter = require('pdfmake');
import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

@Injectable()
export class ExportService {
    private fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique',
        },
    };

    private printer: any;

    constructor() {
        this.printer = new PdfPrinter(this.fonts);
    }

    async generatePdf(docDefinition: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
            const chunks: any[] = [];

            pdfDoc.on('data', (chunk: any) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', (err: any) => reject(err));

            pdfDoc.end();
        });
    }

    async generateExcel(data: any[], sheetName: string = 'Data'): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(sheetName);

        if (data.length > 0) {
            // Auto-generate columns from first item keys
            const columns = Object.keys(data[0]).map(key => ({
                header: key.toUpperCase(),
                key: key,
                width: 20
            }));
            sheet.columns = columns;
            sheet.addRows(data);
        }

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer as unknown as Buffer;
    }
}
