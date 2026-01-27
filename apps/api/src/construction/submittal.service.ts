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

    async approve(id: string, userId: string, comment?: string) {
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
            comment
        };

        const updatedReviews = [...(submittal.reviews as any[] || []), newReview];

        // 2. Check Stage Completion
        // Logic: if type is ONE, one approval is enough. If ALL, need everyone.
        // Simplified for this implementation: assuming ONE for INTERNAL/MK, ALL for EXPERTS
        let stageComplete = false;

        if (currentStage.type === 'ONE') {
            stageComplete = true;
        } else {
            // For ALL, check if all approvers have approved
            const approvalsInThisStage = updatedReviews.filter((r: any) => r.stage === submittal.currentStageIndex && r.status === 'APPROVED');
            const approverIds = new Set(approvalsInThisStage.map((r: any) => r.approverId));
            const requiredApprovers = currentStage.approvers.map((a: any) => a.id);
            stageComplete = requiredApprovers.every((id: string) => approverIds.has(id));
        }

        if (stageComplete) {
            // Move to Next Stage or Finish
            const nextStageIndex = submittal.currentStageIndex + 1;

            if (nextStageIndex >= stages.length) {
                // WORKFLOW COMPLETED -> PUBLISHED
                await this.transitionFileState(submittal.fileId, 'PUBLISHED');

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
                // MOVE TO NEXT STAGE
                const nextStage = stages[nextStageIndex];

                // Specific Logic for WIP -> SHARED transition
                // If distinct stages "Internal" (0) -> "Expert" (1), checking if we just finished stage 0
                if (submittal.currentStageIndex === 0) {
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
            // JUST RECORD APPROVAL, STAY IN STAGE
            return this.prisma.submittal.update({
                where: { id },
                data: {
                    reviews: updatedReviews,
                    // Remove current user from active approvers? Or keep them until stage moves?
                    // Usually keep activeApprovers as "pool of allowed", but maybe filter out who already acted if UI needs it.
                    // For "ALL" type, we can remove this user from activeApprovers to indicate they are done.
                    activeApprovers: submittal.activeApprovers.filter(uid => uid !== userId)
                }
            });
        }
    }

    private async transitionFileState(fileId: string, targetState: 'SHARED' | 'PUBLISHED') {
        console.log(`[Auto-Transition] Moving File ${fileId} to ${targetState}`);

        const file = await this.prisma.file.findUnique({ where: { id: fileId } });
        if (!file) return;

        // 1. Find or Create Target Folder
        // Assumption: "SHARED" and "PUBLISHED" are root-level folders for standard CDE
        let targetFolder = await this.prisma.folder.findFirst({
            where: {
                projectId: file.projectId,
                name: targetState // simplified folder naming
            }
        });

        if (!targetFolder) {
            targetFolder = await this.prisma.folder.create({
                data: {
                    projectId: file.projectId,
                    name: targetState,
                    parentId: null // Root folder
                }
            });
        }

        // 2. Fetch Approval Info for Metadata
        // Find the submittal that triggered this
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

        // 3. Create Copy of File (Simulating "Copy to Folder")
        // In real app, we might also copy the S3 object to a immutable bucket
        await this.prisma.file.create({
            data: {
                name: file.name, // In ISO 19650 this would be renamed e.g. from A to P01
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: file.size,
                s3Key: file.s3Key, // Sharing same S3 object for efficiency in MVP
                uniqueId: `${file.uniqueId}-${targetState}-${Date.now()}`,
                cdeState: targetState,
                uploadedBy: file.uploadedBy,
                folderId: targetFolder.id,
                // Embedding approval info in description to ensure it "travels with the document"
                linkSourceId: file.id, // Traceability
                // We're storing the signature metadata directly in the file record if we had a field,
                // but for now we rely on linkSourceId to find the Submittal, OR validationReports.
                // Let's assume we maintain the link.
            }
        });

        // Note: For "Burning" the signature into the PDF, we would need a PDF processing service here.
        // For MVP, the 'linkSourceId' maintains the chain of custody to the Submittal containing the signature.
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
