import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@Injectable()
export class WorkflowsService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, dto: CreateWorkflowDto) {
        return this.prisma.approvalWorkflow.create({
            data: {
                projectId,
                name: dto.name,
                stages: dto.stages as any, // Json type
                isActive: true
            }
        });
    }

    async findAll(projectId: string) {
        return this.prisma.approvalWorkflow.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        const workflow = await this.prisma.approvalWorkflow.findUnique({
            where: { id }
        });
        if (!workflow) throw new NotFoundException('Workflow not found');
        return workflow;
    }

    async update(id: string, dto: any) {
        await this.findOne(id);
        return this.prisma.approvalWorkflow.update({
            where: { id },
            data: dto
        });
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.prisma.approvalWorkflow.delete({
            where: { id }
        });
    }

    // --- Engine Logic (Stub) ---
    async triggerWorkflow(fileId: string, workflowId: string, userId: string) {
        // Logic: Create an instance of the workflow for this file
        // For MVP, we might just log or update file status directly if simple
        console.log(`[WORKFLOW] Triggered workflow ${workflowId} for file ${fileId} by ${userId}`);
        return { success: true, message: 'Workflow started' };
    }

    async approveStage(instanceId: string, stageIndex: number, userId: string) {
        console.log(`[WORKFLOW] Approved stage ${stageIndex} for instance ${instanceId} by ${userId}`);
        return { success: true, status: 'NEXT_STAGE' };
    }
}
