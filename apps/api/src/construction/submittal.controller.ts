import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { SubmittalService } from './submittal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubmittalType, SubmittalStatus } from '@prisma/client';

export class CreateSubmittalDto {
    projectId: string;
    type: SubmittalType;
    title: string;
    description?: string;
    fileId: string;
    workflowId?: string;
}

export class UpdateStatusDto {
    status: SubmittalStatus;
    reviewComments?: string;
}

@Controller('construction/submittals')
// 🛡️ Sentinel: Enforce authentication to prevent unauthorized submission or approval of workflows
@UseGuards(JwtAuthGuard)
export class SubmittalController {
    constructor(private readonly submittalService: SubmittalService) { }

    @Post()
    async createSubmittal(@Body() dto: CreateSubmittalDto, @Request() req) {
        const userId = req.user?.id || 'user-uuid-placeholder';
        return this.submittalService.createSubmittal({
            ...dto,
            submittedBy: userId,
        });
    }

    @Patch(':id/submit')
    async submitForApproval(@Param('id') id: string) {
        return this.submittalService.submitForApproval(id);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
        return this.submittalService.updateStatus(id, dto.status);
    }

    @Get('project/:projectId')
    async getSubmittals(
        @Param('projectId') projectId: string,
        @Query('type') type?: SubmittalType,
    ) {
        return this.submittalService.getSubmittals(projectId, type);
    }

    @Get(':id')
    async getSubmittalById(@Param('id') id: string) {
        return this.submittalService.getSubmittalById(id);
    }

    @Post(':id/start-workflow')
    async startWorkflow(@Param('id') id: string, @Body() body: { workflowId: string }) {
        return this.submittalService.startWorkflow(id, body.workflowId);
    }

    @Post(':id/approve')
    async approve(@Param('id') id: string, @Body() body: { userId: string, comment?: string, signature?: string }) {
        return this.submittalService.approve(id, body.userId, body.comment, body.signature);
    }
}
