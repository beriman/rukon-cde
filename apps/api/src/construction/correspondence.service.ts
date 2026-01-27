import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from '../common/services/pdf.service';
import { FilesService } from '../files/files.service';
// import { CorrespondenceCategory } from '@prisma/client'; // Disabled until generation

@Injectable()
export class CorrespondenceService {
    constructor(
        private prisma: PrismaService,
        private pdfService: PdfService,
        private filesService: FilesService
    ) { }

    private generateReferenceNumber(type: string, count: number): string {
        const prefix = type === 'SITE_MEMO' ? 'SM' : 'SI';
        return `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }

    async create(data: {
        projectId: string;
        type: string;
        category?: 'GENERAL' | 'OFFICIAL_LETTER';
        from: string;
        userId?: string; // New field for sender ID
        to: string[];
        subject: string;
        message: string;
        attachments?: string[];
    }) {
        try {
            const count = await this.prisma.correspondence.count({
                where: {
                    projectId: data.projectId,
                    type: data.type,
                },
            });

            const referenceNumber = this.generateReferenceNumber(data.type, count);
            let pdfUrl: string | null = null;
            let senderName = data.from;

            // Handle Official Letter Logic
            if (data.category === 'OFFICIAL_LETTER' && data.userId) {
                // Fetch User Details & Org
                const user = await this.prisma.user.findUnique({
                    where: { id: data.userId },
                    include: {
                        organizations: {
                            include: { organization: true },
                            take: 1 // Assuming 1 active org context or primary
                            // Ideally, we should know which Org context the user is acting in.
                            // For now, prompt implies user belongs to an Org sending the letter.
                            // We take the first one or we should pass orgId in DTO.
                        }
                    }
                });

                if (user) {
                    senderName = user.name || user.email;
                    // Try to find the org from project?
                    // Project -> Organization is the OWNER org.
                    // But if Contractor sends letter, they use THEIR letterhead.
                    // We need to know the User's Org Context.
                    // Assuming for MVP the user's first organization is the one.
                    const org = user.organizations[0]?.organization as any;

                    if (org) {
                        const pdfBuffer = await this.pdfService.generateOfficialLetter({
                            headerUrl: org.letterheadHeader,
                            footerUrl: org.letterheadFooter,
                            content: data.message,
                            referenceNumber,
                            date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                            recipient: data.to.join(', '),
                            sender: senderName,
                            subject: data.subject
                        });

                        const uploadRes = await this.filesService.uploadSystemFile(
                            org.id,
                            {
                                buffer: pdfBuffer,
                                originalname: `${referenceNumber}.pdf`,
                                mimetype: 'application/pdf'
                            },
                            'official-letters'
                        );

                        pdfUrl = uploadRes.s3Key; // Storing Key
                    }
                }
            }

            return await this.prisma.correspondence.create({
                data: {
                    projectId: data.projectId,
                    type: data.type,
                    from: senderName,
                    to: data.to,
                    subject: data.subject,
                    message: data.message,
                    referenceNumber,
                    status: data.category === 'OFFICIAL_LETTER' ? 'PENDING_APPROVAL' : 'SENT',
                    attachments: data.attachments || [],
                    category: (data.category === 'OFFICIAL_LETTER' ? 'OFFICIAL_LETTER' : 'GENERAL') as any, // Cast for now
                    pdfUrl, // Initially PDF without signature (Draft) or null
                } as any,
            });
        } catch (error) {
            if (error.code === 'P2003') {
                throw new NotFoundException('Project not found');
            }
            throw new InternalServerErrorException('Failed to create correspondence');
        }
    }

    async approve(id: string, approverId: string) {
        const correspondence = await this.prisma.correspondence.findUnique({
            where: { id },
        });

        if (!correspondence) {
            throw new NotFoundException('Correspondence not found');
        }

        if (correspondence.status !== 'PENDING_APPROVAL') {
            throw new Error('Correspondence is not pending approval');
        }

        const approver = await this.prisma.user.findUnique({
            where: { id: approverId },
            include: {
                organizations: {
                    include: { organization: true },
                    take: 1
                }
            }
        });

        if (!approver) {
            throw new NotFoundException('Approver not found');
        }

        // Ideally check if Approver has MANAGER role in the Organization
        // For MVP, if they can call this endpoint (guarded by role), we proceed.

        // Regenerate PDF with Signature
        const org = approver.organizations[0]?.organization as any;
        let pdfUrl = correspondence.pdfUrl;

        if (org && correspondence.category === 'OFFICIAL_LETTER') {
            const pdfBuffer = await this.pdfService.generateOfficialLetter({
                headerUrl: org.letterheadHeader,
                footerUrl: org.letterheadFooter,
                content: correspondence.message,
                referenceNumber: correspondence.referenceNumber,
                date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                recipient: correspondence.to.join(', '),
                sender: correspondence.from, // Keep original sender name? Or Approver? Usually original sender, but signed by Manager. 
                // Let's use Approver Name as the Signer
                // But typically the letter says "Sincerely, [Name]" and signature matches.
                // If Initiator != Signer, we might need 2 signatures or just the Manager's.
                // Requirement: "setelah manager tanda tangan langsung diteruskan"
                // Usually the Manager becomes the effective sender for official external comms.
                // Or "pp" (per procurationem).
                // Let's replace Sender Name with Approver Name for the signature block to match the signature.
                subject: correspondence.subject,
                signatureUrl: (approver as any).signatureUrl // Type cast until prisma generated
            });

            const uploadRes = await this.filesService.uploadSystemFile(
                org.id,
                {
                    buffer: pdfBuffer,
                    originalname: `${correspondence.referenceNumber}_SIGNED.pdf`,
                    mimetype: 'application/pdf'
                },
                'official-letters'
            );
            pdfUrl = uploadRes.s3Key;
        }

        return await this.prisma.correspondence.update({
            where: { id },
            data: {
                status: 'SENT',
                approvedById: approverId,
                approvedAt: new Date(),
                pdfUrl,
                // update from field? Maybe keep original initiator but PDF shows Manager.
            } as any
        });
    }

    async markAsRead(id: string) {
        try {
            return await this.prisma.correspondence.update({
                where: { id },
                data: { status: 'READ' },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Correspondence not found');
            }
            throw new InternalServerErrorException('Failed to mark as read');
        }
    }

    async reply(id: string, replyData: {
        from: string;
        message: string;
    }) {
        try {
            await this.prisma.correspondence.update({
                where: { id },
                data: { status: 'REPLIED' },
            });

            // In real implementation, create a linked reply correspondence
            return { success: true };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Correspondence not found');
            }
            throw new InternalServerErrorException('Failed to send reply');
        }
    }

    async getCorrespondences(projectId: string, type?: string) {
        try {
            return await this.prisma.correspondence.findMany({
                where: {
                    projectId,
                    ...(type && { type }),
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch correspondences');
        }
    }

    async getById(id: string) {
        try {
            const correspondence = await this.prisma.correspondence.findUnique({
                where: { id },
            });

            if (!correspondence) {
                throw new NotFoundException('Correspondence not found');
            }

            return correspondence;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch correspondence');
        }
    }
}
