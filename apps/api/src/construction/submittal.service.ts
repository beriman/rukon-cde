import { Injectable, NotFoundException, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmittalType, SubmittalStatus } from '@prisma/client';

@Injectable()
export class SubmittalService {
    constructor(private prisma: PrismaService) { }

    private generateReferenceNumber(type: string, count: number): string {
        const prefix = {
            'SHOP_DRAWING': 'SD',
            'METHOD_STATEMENT': 'MS',
            'MATERIAL_APPROVAL': 'MA',
        }[type] || 'SUB';

        return `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }

    async createSubmittal(data: {
        projectId: string;
        type: SubmittalType;
        title: string;
        fileId?: string;
        submittedBy: string;
    }) {
        try {
            const count = await this.prisma.submittal.count({
                where: {
                    projectId: data.projectId,
                    type: data.type,
                },
            });

            const referenceNumber = this.generateReferenceNumber(data.type, count);

            return await this.prisma.submittal.create({
                data: {
                    projectId: data.projectId,
                    type: data.type,
                    referenceNumber,
                    title: data.title,
                    fileId: data.fileId,
                    submittedBy: data.submittedBy,
                    status: 'DRAFT' as SubmittalStatus,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Submittal with this reference number already exists');
            }
            if (error.code === 'P2003') {
                throw new NotFoundException('Related resource not found');
            }
            throw new InternalServerErrorException('Failed to create submittal');
        }
    }

    async submitForApproval(id: string) {
        try {
            const submittal = await this.prisma.submittal.findUnique({ where: { id } });

            if (!submittal) {
                throw new NotFoundException('Submittal not found');
            }

            return await this.prisma.submittal.update({
                where: { id },
                data: { status: 'SUBMITTED' as SubmittalStatus },
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to submit');
        }
    }

    async startWorkflow(id: string, workflowId: string) {
        const submittal = await this.prisma.submittal.findUnique({ where: { id } });
        const workflow = await this.prisma.approvalWorkflow.findUnique({ where: { id: workflowId } });

        if (!submittal || !workflow) throw new NotFoundException('Submittal or Workflow not found');

        const stages = workflow.stages as any[];
        const firstStage = stages[0];

        return this.prisma.submittal.update({
            where: { id },
            data: {
                workflowId,
                status: 'UNDER_REVIEW',
                currentStageIndex: 0,
                // @ts-ignore
                activeApprovers: firstStage.approvers.map((a: any) => a.id),
                reviews: [] // Initialize history
            }
        });
    }

    async approve(id: string, userId: string, comment?: string, signature?: string) {
        const submittal = await this.prisma.submittal.findUnique({
            where: { id },
            include: { workflow: true }
        });

        if (!submittal || !submittal.workflow) throw new NotFoundException('Submittal or Workflow not found');
        if (!submittal.activeApprovers.includes(userId)) throw new BadRequestException('User is not an active approver');

        const stages = submittal.workflow.stages as any[];
        const currentStage = stages[submittal.currentStageIndex];

        // 1. Record Review
        const newReview = {
            stage: submittal.currentStageIndex,
            approverId: userId,
            status: 'APPROVED',
            date: new Date(),
            comment,
            signature // Store the signature data/URL
        };

        const updatedReviews = [...(submittal.reviews as any[] || []), newReview];

        // 2. Check Stage Completion
        let stageComplete = false;

        if (currentStage.type === 'ONE') {
            stageComplete = true;
        } else {
            const approvalsInThisStage = updatedReviews.filter((r: any) => r.stage === submittal.currentStageIndex && r.status === 'APPROVED');
            const approverIds = new Set(approvalsInThisStage.map((r: any) => r.approverId));
            const requiredApprovers = currentStage.approvers.map((a: any) => a.id);
            stageComplete = requiredApprovers.every((id: string) => approverIds.has(id));
        }

        if (stageComplete) {
            const nextStageIndex = submittal.currentStageIndex + 1;

            if (nextStageIndex >= stages.length) {
                await this.transitionFileState(submittal.fileId!, 'PUBLISHED');

                return this.prisma.submittal.update({
                    where: { id },
                    data: {
                        status: 'APPROVED',
                        reviews: updatedReviews,
                        activeApprovers: [],
                        reviewComments: "Workflow Completed"
                    }
                });
            } else {
                const nextStage = stages[nextStageIndex];

                if (submittal.currentStageIndex === 0 && submittal.fileId) {
                    await this.transitionFileState(submittal.fileId, 'SHARED');
                }

                return this.prisma.submittal.update({
                    where: { id },
                    data: {
                        currentStageIndex: nextStageIndex,
                        activeApprovers: nextStage.approvers.map((a: any) => a.id),
                        reviews: updatedReviews,
                    }
                });
            }
        } else {
            return this.prisma.submittal.update({
                where: { id },
                data: {
                    reviews: updatedReviews,
                    activeApprovers: submittal.activeApprovers.filter(uid => uid !== userId)
                }
            });
        }
    }

    private async transitionFileState(fileId: string, targetState: 'SHARED' | 'PUBLISHED') {
        console.log(`[Auto-Transition] Moving File ${fileId} to ${targetState}`);

        const file = await this.prisma.file.findUnique({ 
            where: { id: fileId },
            include: { folder: true }
        });
        if (!file) return;

        const projectId = file.folder.projectId;

        let targetFolder = await this.prisma.folder.findFirst({
            where: {
                projectId: projectId,
                name: targetState
            }
        });

        if (!targetFolder) {
            targetFolder = await this.prisma.folder.create({
                data: {
                    projectId: projectId,
                    name: targetState,
                    parentId: null
                }
            });
        }

        const submittal = await this.prisma.submittal.findFirst({
            where: { fileId: fileId },
            orderBy: { createdAt: 'desc' },
            take: 1
        });

        let approvalMetadata = '';
        if (submittal && submittal.reviews) {
            const reviews = submittal.reviews as any[];
            const lastApproval = reviews[reviews.length - 1];
            if (lastApproval) {
                approvalMetadata = `Approved by ${lastApproval.approverId} on ${new Date().toISOString()}. Signature: ${lastApproval.signature ? 'Included' : 'None'}`;
            }
        }

        await this.prisma.file.create({
            data: {
                name: file.name,
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: file.size,
                s3Key: file.s3Key,
                uniqueId: `${file.uniqueId}-${targetState}-${Date.now()}`,
                cdeState: targetState,
                uploadedBy: file.uploadedBy,
                folderId: targetFolder.id,
                linkSourceId: file.id,
            }
        });
    }

    /* Existing methods... */
    async updateStatus(id: string, status: SubmittalStatus) {
        try {
            return await this.prisma.submittal.update({
                where: { id },
                data: { status },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Submittal not found');
            }
            throw new InternalServerErrorException('Failed to update status');
        }
    }

    async getSubmittals(projectId: string, type?: SubmittalType) {
        try {
            return await this.prisma.submittal.findMany({
                where: {
                    projectId,
                    ...(type && { type }),
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch submittals');
        }
    }

    async getSubmittalById(id: string) {
        try {
            const submittal = await this.prisma.submittal.findUnique({
                where: { id },
                include: {
                    file: true,
                    submitter: { select: { id: true, name: true, email: true } },
                },
            });

            if (!submittal) {
                throw new NotFoundException('Submittal not found');
            }

            return submittal;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch submittal');
        }
    }
}
