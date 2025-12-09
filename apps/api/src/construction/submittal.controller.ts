import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { SubmittalService } from './submittal.service';
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
// @UseGuards(JwtAuthGuard)
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
        return this.submittalService.updateStatus(id, dto.status, dto.reviewComments);
    }

    @Get('project/:projectId')
    async getSubmittals(
        @Param('projectId') projectId: string,
        @Query('status') status?: SubmittalStatus,
    ) {
        return this.submittalService.getSubmittals(projectId, status);
    }

    @Get(':id')
    async getSubmittalById(@Param('id') id: string) {
        return this.submittalService.getSubmittalById(id);
    }
}
