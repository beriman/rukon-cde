import { Controller, Post, Body, Param, UseGuards, Request, Get, Patch, BadRequestException, NotFoundException, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditAction, SubscriptionPlan, ProjectStatus } from '@prisma/client';

@Controller('projects-business')
@UseGuards(JwtAuthGuard)
export class ProjectsBusinessController {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
        private notificationsService: NotificationsService
    ) { }

    // Story: Join Project via ID
    @Post('join/:projectId')
    async requestToJoin(@Request() req, @Param('projectId') projectId: string) {
        const userId = req.user.id;

        // Check if project exists
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { organization: true }
        });

        if (!project) throw new NotFoundException('Project ID not found');

        // Check if already a member
        const isMember = await this.prisma.organizationUser.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: project.organizationId
                }
            }
        });

        if (isMember) throw new BadRequestException('You are already a member of this project');

        // Create Join Request
        const joinRequest = await this.prisma.projectJoinRequest.upsert({
            where: {
                projectId_userId: { projectId, userId }
            },
            update: { status: 'PENDING' },
            create: {
                projectId,
                userId,
                status: 'PENDING'
            }
        });

        // Notify Project Owner
        if (project.ownerId) {
            await this.notificationsService.create({
                userId: project.ownerId,
                type: 'PROJECT_JOIN_REQUEST',
                title: 'New Join Request',
                message: `User ${req.user.email} wants to join project ${project.name}.`,
                data: { projectId, userId, requestId: joinRequest.id }
            });
        }

        return { message: 'Join request sent to project owner' };
    }

    // Story: Accept/Reject Join Request
    @Patch('requests/:requestId/respond')
    async respondToJoinRequest(
        @Request() req,
        @Param('requestId') requestId: string,
        @Body() body: { action: 'ACCEPT' | 'REJECT' }
    ) {
        const joinRequest = await this.prisma.projectJoinRequest.findUnique({
            where: { id: requestId },
            include: { project: true }
        });

        if (!joinRequest) throw new NotFoundException('Request not found');

        // Security: Only project owner can respond
        if (joinRequest.project.ownerId !== req.user.id) {
            throw new BadRequestException('Only the project owner can approve join requests');
        }

        if (body.action === 'ACCEPT') {
            await this.prisma.$transaction([
                // Update request status
                this.prisma.projectJoinRequest.update({
                    where: { id: requestId },
                    data: { status: 'ACCEPTED' }
                }),
                // Add user to organization
                this.prisma.organizationUser.upsert({
                    where: {
                        userId_organizationId: {
                            userId: joinRequest.userId,
                            organizationId: joinRequest.project.organizationId
                        }
                    },
                    update: { role: 'MEMBER' },
                    create: {
                        userId: joinRequest.userId,
                        organizationId: joinRequest.project.organizationId,
                        role: 'MEMBER'
                    }
                })
            ]);

            // Notify User
            await this.notificationsService.create({
                userId: joinRequest.userId,
                type: 'PROJECT_JOIN_ACCEPTED',
                title: 'Request Accepted',
                message: `You have been accepted into project ${joinRequest.project.name}.`,
            });

            return { message: 'User accepted into project' };
        } else {
            await this.prisma.projectJoinRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });

            return { message: 'Join request rejected' };
        }
    }

    // Story: Create Paid Project (Simulation)
    @Post('create-paid')
    async createPaidProject(
        @Request() req,
        @Body() body: { 
            name: string, 
            code: string, 
            organizationId: string, 
            plan: 'UMKM' | 'KORPORASI' 
        }
    ) {
        // Validation
        if (!body.name || !body.code || !body.organizationId) {
            throw new BadRequestException('Missing project details');
        }

        const project = await this.prisma.project.create({
            data: {
                name: body.name,
                code: body.code,
                organizationId: body.organizationId,
                ownerId: req.user.id,
                plan: body.plan as SubscriptionPlan,
                status: ProjectStatus.PENDING_PAYMENT, // Needs checkout
                isPaid: false
            }
        });

        // Audit Log
        await this.auditService.log(req.user.id, AuditAction.PROJECT_CREATE, project.id, 'PROJECT', { plan: body.plan });

        return { 
            projectId: project.id,
            message: 'Project created. Please proceed to payment to activate.',
            checkoutUrl: `/dashboard/projects/${project.id}/checkout` // Simulation URL
        };
    }

    // Story: Create Project Team (Group) and WIP Folder
    @Post(':projectId/teams')
    async createTeam(
        @Request() req,
        @Param('projectId') projectId: string,
        @Body() body: { name: string, leaderId?: string }
    ) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { folders: { where: { name: '01-WIP' } } }
        });

        if (!project || project.ownerId !== req.user.id) {
            throw new BadRequestException('Unauthorized or project not found');
        }

        const wipRoot = project.folders[0];
        if (!wipRoot) throw new BadRequestException('WIP Root folder not found in this project');

        return this.prisma.$transaction(async (tx) => {
            // 1. Create WIP Folder for this Team
            const teamFolder = await tx.folder.create({
                data: {
                    name: body.name,
                    projectId: projectId,
                    parentId: wipRoot.id,
                    isSystem: true,
                    discipline: 'GENERAL'
                }
            });

            // 2. Create the Team
            const team = await tx.projectTeam.create({
                data: {
                    projectId,
                    name: body.name,
                    leaderId: body.leaderId,
                    wipFolderId: teamFolder.id
                }
            });

            return team;
        });
    }

    // Story: Add User to Team
    @Post('teams/:teamId/members')
    async addMemberToTeam(
        @Request() req,
        @Param('teamId') teamId: string,
        @Body() body: { userId: string }
    ) {
        const team = await this.prisma.projectTeam.findUnique({
            where: { id: teamId },
            include: { project: true }
        });

        if (!team || team.project.ownerId !== req.user.id) {
            throw new BadRequestException('Unauthorized');
        }

        return this.prisma.projectTeam.update({
            where: { id: teamId },
            data: {
                members: { connect: { id: body.userId } }
            }
        });
    }

    // Story: Team submits S-Curve / Schedule
    @Post('teams/:teamId/submissions')
    async submitToAdmin(
        @Request() req,
        @Param('teamId') teamId: string,
        @Body() body: { type: string, content: any }
    ) {
        const team = await this.prisma.projectTeam.findUnique({
            where: { id: teamId },
            include: { project: true }
        });

        if (!team) throw new NotFoundException('Team not found');

        // Logic: Only leader can submit
        if (team.leaderId !== req.user.id) {
            throw new BadRequestException('Only team leaders can submit to Admin');
        }

        const submission = await this.prisma.teamSubmission.create({
            data: {
                teamId,
                type: body.type,
                content: body.content,
                status: 'PENDING'
            }
        });

        // Notify Admin
        await this.notificationsService.create({
            userId: team.project.ownerId!,
            type: 'TEAM_SUBMISSION',
            title: `New ${body.type} from ${team.name}`,
            message: `Team ${team.name} has submitted a new ${body.type.toLowerCase()} for your review.`,
            data: { teamId, submissionId: submission.id }
        });

        return submission;
    }

    // Story: Admin pins a submission to the Dashboard
    @Patch('projects/:projectId/pin/:submissionId')
    async pinToDashboard(
        @Request() req,
        @Param('projectId') projectId: string,
        @Param('submissionId') submissionId: string
    ) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.ownerId !== req.user.id) throw new BadRequestException('Unauthorized');

        const submission = await this.prisma.teamSubmission.findUnique({
            where: { id: submissionId }
        });

        if (!submission) throw new NotFoundException('Submission not found');

        // Update Project Pinned Items
        const currentPins = (project.pinnedItems as any) || {};
        
        // Pin based on type
        if (submission.type === 'SCURVE') currentPins.sCurve = submission.content;
        if (submission.type === 'MILESTONE') {
            currentPins.milestones = currentPins.milestones || [];
            currentPins.milestones.push(submission.content);
        }

        await this.prisma.$transaction([
            this.prisma.project.update({
                where: { id: projectId },
                data: { pinnedItems: currentPins }
            }),
            this.prisma.teamSubmission.update({
                where: { id: submissionId },
                data: { status: 'PINNED' }
            })
        ]);

        return { message: 'Item pinned to Project Dashboard' };
    }

    // Story: Admin sets project stage (Unified Dashboard state)
    @Patch('projects/:projectId/stage')
    async updateProjectStage(
        @Request() req,
        @Param('projectId') projectId: string,
        @Body() body: { stage: string }
    ) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.ownerId !== req.user.id) throw new BadRequestException('Unauthorized');

        return this.prisma.project.update({
            where: { id: projectId },
            data: { currentStage: body.stage as any }
        });
    }

    // Story: Admin manages active widgets on the Project Dashboard
    @Patch('projects/:projectId/widgets')
    async updateActiveWidgets(
        @Request() req,
        @Param('projectId') projectId: string,
        @Body() body: { widgets: string[] }
    ) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.ownerId !== req.user.id) throw new BadRequestException('Unauthorized');

        return this.prisma.project.update({
            where: { id: projectId },
            data: { activeWidgets: body.widgets }
        });
    }

    // Story: Admin manages Watermark settings
    @Patch('projects/:projectId/watermark')
    async updateWatermark(
        @Request() req,
        @Param('projectId') projectId: string,
        @Body() body: { enabled: boolean, config: any }
    ) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.ownerId !== req.user.id) throw new BadRequestException('Unauthorized');

        return this.prisma.project.update({
            where: { id: projectId },
            data: { 
                watermarkEnabled: body.enabled,
                watermarkConfig: body.config 
            }
        });
    }

    // Story: Get MIDP (Master Information Delivery Plan) Analytics
    @Get('projects/:projectId/midp-analytics')
    async getMidpAnalytics(@Param('projectId') projectId: string) {
        // Aggregating data from TaskDeliverable table
        const deliverables = await this.prisma.taskDeliverable.findMany({
            where: { 
                taskDeliveryPlan: { projectId } 
            }
        });

        // Group by Discipline (originator or role)
        const stats: any = {};
        const disciplines = ['ARCH', 'STRUCT', 'MEP'];

        disciplines.forEach(d => {
            const group = deliverables.filter(item => item.originator === d || item.role === d);
            stats[d] = {
                totalPlanned: group.length,
                submitted: group.filter(item => item.status === 'DELIVERED').length,
                approved: group.filter(item => item.status === 'APPROVED').length, // Assuming APPROVED is a state
                rejected: group.filter(item => item.status === 'REJECTED').length
            };
        });

        return {
            projectId,
            timestamp: new Date(),
            summary: stats
        };
    }

    // Story: Generate Quick Audit Report (Data Assembly)
    @Get('projects/:projectId/audit-report-data')
    async getAuditReportData(@Param('projectId') projectId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { organization: true }
        });

        if (!project) throw new NotFoundException('Project not found');

        const midp = await this.getMidpAnalytics(projectId);
        
        // Mocking some extra data for the "meat" of the report
        const report = {
            projectInfo: {
                name: project.name,
                code: project.code,
                organization: project.organization.name,
                stage: project.currentStage,
                generatedAt: new Date().toISOString(),
                auditId: `AUD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            },
            compliance: {
                iso19650Score: 92,
                namingConventionCompliance: '98%',
                unresolvedClashes: 12
            },
            midpSummary: midp.summary,
            hse: {
                safeManHours: 420500,
                zeroLtiAchieved: true,
                lastIncidentDate: 'None recorded'
            },
            financials: {
                plannedBudget: 'IDR 3.4T',
                actualSpent: 'IDR 1.2T',
                variance: '-0.4% (Healthy)'
            }
        };

        return report;
    }

    // Story: Initialize Workflow Presets for a Project
    @Post(':projectId/workflows/init-presets')
    async initWorkflowPresets(@Request() req, @Param('projectId') projectId: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.ownerId !== req.user.id) throw new BadRequestException('Unauthorized');

        const presets = [
            {
                name: 'Material Approval Request (MAR)',
                description: 'Workflow for approving materials brought to site.',
                stages: [
                    { order: 1, role: 'QS', name: 'Price & Spec Check' },
                    { order: 2, role: 'ARCH', name: 'Aesthetic Approval' },
                    { order: 3, role: 'PM', name: 'Final Sign-off' }
                ]
            },
            {
                name: 'Shop Drawing Review',
                description: 'ISO 19650 transition from WIP to SHARED.',
                stages: [
                    { order: 1, role: 'BIM_COORD', name: 'Technical Review' },
                    { order: 2, role: 'LEAD_ARCH', name: 'Design Review' }
                ]
            },
            {
                name: 'Method Statement Approval',
                description: 'Approval for specialized work methods (e.g. Deep Piling).',
                stages: [
                    { order: 1, role: 'HSE', name: 'Safety Review' },
                    { order: 2, role: 'STRUCT_ENG', name: 'Structural Audit' }
                ]
            }
        ];

        for (const p of presets) {
            await this.prisma.approvalWorkflow.create({
                data: {
                    projectId,
                    name: p.name,
                    description: p.description,
                    stages: p.stages
                }
            });
        }

        return { message: 'Workflow presets initialized' };
    }

    // Story: Mock Payment Success
    @Post('checkout/:projectId/success')
    async paymentSuccess(@Request() req, @Param('projectId') projectId: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Project not found');
        if (project.ownerId !== req.user.id) throw new BadRequestException('Unauthorized');

        await this.prisma.project.update({
            where: { id: projectId },
            data: {
                status: ProjectStatus.ACTIVE,
                isPaid: true
            }
        });

        return { message: 'Payment successful! Project is now active.' };
    }
}
