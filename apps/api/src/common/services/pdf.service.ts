import { Injectable, InternalServerErrorException } from '@nestjs/common';
import PdfPrinter = require('pdfmake');
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

@Injectable()
export class PdfService {
    private fonts = {
        Roboto: {
            normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
            bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
            italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
            bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
        }
    };

    /**
     * Generate Official Letter PDF
     */
    async generateOfficialLetter(data: {
        headerUrl?: string | null;
        footerUrl?: string | null;
        content: string;
        referenceNumber: string;
        date: string;
        recipient: string;
        sender: string;
        subject: string;
        signatureUrl?: string | null;
    }): Promise<Buffer> {
        const printer = new PdfPrinter(this.fonts);
        const content: Content = [];

        // 1. Header Image
        if (data.headerUrl) {
            try {
                const headerBase64 = await this.fetchImage(data.headerUrl);
                content.push({
                    image: headerBase64,
                    width: 500, // Approx A4 width (595) minus margins
                    alignment: 'center',
                    marginBottom: 20
                });
            } catch (e) {
                console.warn(`[PDF] Failed to load header: ${e.message}`);
            }
        }

        // 2. Metadata (Ref & Date)
        content.push({
            columns: [
                { text: `No: ${data.referenceNumber}`, bold: true, width: 'auto' },
                { text: data.date, alignment: 'right', width: '*' }
            ],
            marginBottom: 20
        });

        // 3. Recipient
        content.push({
            text: [
                { text: 'Kepada Yth,\n', bold: true },
                data.recipient,
                '\n\n'
            ],
            marginBottom: 20
        });

        // 4. Subject
        content.push({
            text: [
                { text: 'Perihal: ', bold: true },
                { text: data.subject, decoration: 'underline' }
            ],
            marginBottom: 20
        });

        // 5. Body
        content.push({
            text: data.content, // PDFMake interprets \n as newline
            marginBottom: 40,
            alignment: 'justify',
            lineHeight: 1.2
        });

        // 6. Sender / Signature
        const signatureStack: Content[] = [
            { text: 'Hormat Kami,', alignment: 'center', marginBottom: 5 }
        ];

        if (data.signatureUrl) {
            try {
                const signatureBase64 = await this.fetchImage(data.signatureUrl);
                signatureStack.push({
                    image: signatureBase64,
                    width: 100, // Reasonable signature width
                    alignment: 'center',
                    marginTop: 5,
                    marginBottom: 5
                });
            } catch (e) {
                console.warn(`[PDF] Failed to load signature: ${e.message}`);
                // Fallback space if download fails
                signatureStack.push({ text: '\n\n\n', marginBottom: 30 });
            }
        } else {
            // Space for manual signature if no digital signature
            signatureStack.push({ text: '\n\n\n', marginBottom: 30 });
        }

        signatureStack.push({ text: data.sender, bold: true, alignment: 'center', decoration: 'underline' });

        content.push({
            columns: [
                // QR Verification Code (Dynamic Image)
                {
                    width: 100,
                    stack: [
                        {
                            image: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://rukon.io/verify/${data.referenceNumber}`,
                            width: 60,
                            alignment: 'left'
                        },
                        { text: 'SCAN TO VERIFY', fontSize: 7, bold: true, marginTop: 5, color: '#3b82f6' }
                    ]
                },
                { width: '*', text: '' },
                {
                    width: 200,
                    stack: signatureStack
                }
            ],
            marginTop: 20
        });

        // 7. Footer Image
        if (data.footerUrl) {
            try {
                const footerBase64 = await this.fetchImage(data.footerUrl);
                content.push({
                    image: footerBase64,
                    width: 500, // A4 Width approx
                    alignment: 'center',
                    marginTop: 30
                });
            } catch (e) {
                console.warn(`[PDF] Failed to load footer: ${e.message}`);
            }
        }

        const docDefinition: TDocumentDefinitions = {
            content: content,
            defaultStyle: {
                font: 'Roboto',
                fontSize: 11
            },
            pageMargins: [50, 40, 50, 40], // Top/Bottom margins
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

    private async fetchImage(url: string): Promise<string> {
        // Handle Presigned URLs or Public URLs
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Determine mime type (simple check)
        const mime = response.headers.get('content-type') || 'image/png';
        return `data:${mime};base64,${buffer.toString('base64')}`;
    }
}
