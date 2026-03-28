import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CobieField {
    fieldName: string;
    required: boolean;
    category: string;
}

const REQUIRED_COBIE_FIELDS: CobieField[] = [
    { fieldName: 'Name', required: true, category: 'Component' },
    { fieldName: 'TypeName', required: true, category: 'Component' },
    { fieldName: 'Space', required: true, category: 'Component' },
    { fieldName: 'SerialNumber', required: false, category: 'Component' },
    { fieldName: 'InstallationDate', required: false, category: 'Component' },
    { fieldName: 'WarrantyStartDate', required: false, category: 'Component' },
    { fieldName: 'TagNumber', required: false, category: 'Component' },
    { fieldName: 'BarCode', required: false, category: 'Component' },
];

@Injectable()
export class CobieService {
    constructor(private prisma: PrismaService) { }

    async validateFile(data: {
        projectId: string;
        fileId: string;
        fileName: string;
        elements: Array<{ [key: string]: any }>;
    }) {
        try {
            if (!data.elements || data.elements.length === 0) {
                throw new BadRequestException('No elements provided for validation');
            }

            let compliantElements = 0;
            const missingFields: Array<{ elementId: string; missingFields: string[] }> = [];
            const CHUNK_SIZE = 5000;

            for (let i = 0; i < data.elements.length; i += CHUNK_SIZE) {
                const chunk = data.elements.slice(i, i + CHUNK_SIZE);

                // Yield to the event loop every chunk
                if (i > 0) {
                    await new Promise(resolve => setImmediate(resolve));
                }

                for (const element of chunk) {
                    const missing = REQUIRED_COBIE_FIELDS
                        .filter(field => field.required && !element[field.fieldName])
                        .map(field => field.fieldName);

                    if (missing.length === 0) {
                        compliantElements++;
                    } else {
                        missingFields.push({
                            elementId: element.id || element.Name || 'Unknown',
                            missingFields: missing,
                        });
                    }
                }
            }

            const complianceScore = data.elements.length > 0
                ? (compliantElements / data.elements.length) * 100
                : 0;

            return await this.prisma.cobieValidation.create({
                data: {
                    projectId: data.projectId,
                    fileId: data.fileId,
                    fileName: data.fileName,
                    totalElements: data.elements.length,
                    compliantElements,
                    complianceScore: parseFloat(complianceScore.toFixed(2)),
                    missingFields: missingFields,
                },
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to validate COBie data');
        }
    }

    async getValidations(projectId: string) {
        try {
            return await this.prisma.cobieValidation.findMany({
                where: { projectId },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch validations');
        }
    }

    async getLatestValidation(projectId: string) {
        try {
            return await this.prisma.cobieValidation.findFirst({
                where: { projectId },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch latest validation');
        }
    }
}
