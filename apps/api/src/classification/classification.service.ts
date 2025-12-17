import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ClassificationCode {
    code: string;
    description: string;
    system: string;
}

// Mock subset of Uniclass 2015
const UNICLASS_MOCK: ClassificationCode[] = [
    { code: 'Ef_20_10', description: 'Walls (Elements)', system: 'Uniclass 2015' },
    { code: 'Ef_20_20', description: 'Floors (Elements)', system: 'Uniclass 2015' },
    { code: 'Ef_20_30', description: 'Roofs (Elements)', system: 'Uniclass 2015' },
    { code: 'Ss_25_10_32', description: 'Reinforced concrete wall systems', system: 'Uniclass 2015' },
    { code: 'Ss_30_10_30', description: 'Excavation systems', system: 'Uniclass 2015' },
    { code: 'Pr_20_29_08', description: 'Cement (Products)', system: 'Uniclass 2015' },
];

@Injectable()
export class ClassificationService {
    constructor(private prisma: PrismaService) { }

    async searchCodes(query: string, system: string = 'Uniclass 2015'): Promise<ClassificationCode[]> {
        const lowerQuery = query.toLowerCase();
        // In real app, this would query a dedicated DB or search engine
        return UNICLASS_MOCK.filter(c =>
            c.system === system &&
            (c.code.toLowerCase().includes(lowerQuery) || c.description.toLowerCase().includes(lowerQuery))
        );
    }

    async assignCode(projectId: string, elementGuid: string, codeData: ClassificationCode) {
        return this.prisma.classificationAssignment.upsert({
            where: {
                projectId_elementGuid_system: {
                    projectId,
                    elementGuid,
                    system: codeData.system
                }
            },
            update: {
                code: codeData.code,
                description: codeData.description
            },
            create: {
                projectId,
                elementGuid,
                system: codeData.system,
                code: codeData.code,
                description: codeData.description
            }
        });
    }

    async getProjectAssignments(projectId: string) {
        return this.prisma.classificationAssignment.findMany({
            where: { projectId }
        });
    }
}
