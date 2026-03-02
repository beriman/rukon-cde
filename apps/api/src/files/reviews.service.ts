import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmittalStatus, AuditAction } from '@prisma/client';
import { AuditService } from '../common/services/audit.service';

@Injectable()
export class ReviewsService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) {}

    /**
     * Mengajukan file untuk ditinjau (Submit for Review)
     */
    async initiateReview(fileId: string, workflowId: string, submittedBy: string) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
            include: { folder: true }
        });

        if (!file) throw new NotFoundException('File not found');
        if (file.cdeState === 'ARCHIVED') throw new BadRequestException('Cannot review archived files');

        const workflow = await this.prisma.approvalWorkflow.findUnique({
            where: { id: workflowId }
        });

        if (!workflow) throw new NotFoundException('Workflow template not found');

        // Buat rekaman Submittal (Review)
        const submittal = await this.prisma.submittal.create({
            data: {
                projectId: file.folder.projectId,
                type: 'SHOP_DRAWING', // Default type for CDE review
                referenceNumber: `REV-${file.uniqueId}-${Date.now().toString().slice(-4)}`,
                title: `Review for ${file.name}`,
                fileId: file.id,
                workflowId: workflow.id,
                status: SubmittalStatus.SUBMITTED,
                submittedBy,
                currentStageIndex: 0,
                // Ambil approver tahap pertama dari workflow
                activeApprovers: (workflow.stages as any)[0]?.approvers || [],
            }
        });

        // Update status file ke UNDER_REVIEW (opsional, atau tetap WIP tapi terkunci)
        await this.prisma.file.update({
            where: { id: fileId },
            data: { cdeState: 'WIP' } // Tetap WIP tapi ada submittal aktif
        });

        await this.auditService.log(submittedBy, AuditAction.FILE_PROMOTE, fileId, 'FILE', {
            submittalId: submittal.id,
            message: 'File submitted for formal review'
        });

        return submittal;
    }

    /**
     * Memberikan keputusan review (Approve/Reject)
     */
    async processReviewStep(submittalId: string, userId: string, status: 'APPROVED' | 'REJECTED' | 'APPROVED_WITH_NOTES', comments?: string) {
        const submittal = await this.prisma.submittal.findUnique({
            where: { id: submittalId },
            include: { workflow: true, file: true }
        });

        if (!submittal) throw new NotFoundException('Review not found');
        if (!submittal.activeApprovers.includes(userId)) {
            throw new BadRequestException('You are not an authorized reviewer for this stage');
        }

        const stages = submittal.workflow?.stages as any[] || [];
        const isLastStage = submittal.currentStageIndex === stages.length - 1;

        let nextStatus: SubmittalStatus = SubmittalStatus.UNDER_REVIEW;
        let nextStageIndex = submittal.currentStageIndex;
        let nextApprovers = submittal.activeApprovers;

        if (status === 'REJECTED') {
            nextStatus = SubmittalStatus.REJECTED;
        } else if (isLastStage) {
            nextStatus = status === 'APPROVED' ? SubmittalStatus.APPROVED : SubmittalStatus.APPROVED_WITH_NOTES;
            
            // PROMOSI OTOMATIS: Jika disetujui di tahap akhir, pindahkan status CDE
            await this.prisma.file.update({
                where: { id: submittal.fileId },
                data: { 
                    cdeState: 'SHARED', // Promosi ke status SHARED (ISO 19650)
                    updatedAt: new Date()
                }
            });

            // Update juga status di versi terbaru
            await this.prisma.fileVersion.updateMany({
                where: { fileId: submittal.fileId, version: submittal.file.currentVersion },
                data: { cdeState: 'SHARED' }
            });

        } else {
            // Pindah ke tahap berikutnya
            nextStageIndex++;
            nextApprovers = stages[nextStageIndex]?.approvers || [];
        }

        const updatedSubmittal = await this.prisma.submittal.update({
            where: { id: submittalId },
            data: {
                status: nextStatus,
                currentStageIndex: nextStageIndex,
                activeApprovers: nextApprovers,
                reviewComments: comments,
                reviews: [
                    ...(submittal.reviews as any[] || []),
                    {
                        stage: submittal.currentStageIndex,
                        approver: userId,
                        status,
                        comments,
                        date: new Date()
                    }
                ]
            }
        });

        return updatedSubmittal;
    }
}
