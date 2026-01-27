import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ApprovalType = 'ONE' | 'ALL';

export interface WorkflowStage {
    name: string;
    key: string;
    type: ApprovalType;
    approvers: {
        id: string; // User ID
        role?: string; // Optional: "Project Manager"
    }[];
}

@Injectable()
export class ApprovalService {
    constructor(private prisma: PrismaService) { }

    async createWorkflow(projectId: string, name: string, stages: WorkflowStage[]) {
        return this.prisma.approvalWorkflow.create({
            data: {
                projectId,
                name,
                stages: stages as any, // Prisma Json type
                isActive: true
            }
        });
    }

    async getProjectWorkflows(projectId: string) {
        return this.prisma.approvalWorkflow.findMany({
            where: { projectId, isActive: true }
        });
    }

    // Helper to generate a default ISO 19650 Workflow
    async seedDefaultWorkflow(projectId: string, contractorLeadId: string, experts: string[], mkLeadId: string) {
        const stages: WorkflowStage[] = [
            {
                name: 'Internal Review',
                key: 'INTERNAL',
                type: 'ONE',
                approvers: [{ id: contractorLeadId, role: 'Contractor Lead' }]
            },
            {
                name: 'Expert Review',
                key: 'EXPERT_REVIEW',
                type: 'ALL',
                approvers: experts.map(id => ({ id, role: 'Tenaga Ahli' }))
            },
            {
                name: 'MK Approval',
                key: 'MK_APPROVAL',
                type: 'ONE',
                approvers: [{ id: mkLeadId, role: 'MK Lead' }]
            }
        ];

        return this.createWorkflow(projectId, 'Standard ISO 19650 Approval (WIP -> SHARED -> PUBLISHED)', stages);
    }
}
