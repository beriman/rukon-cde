import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class CreateClaimDto {
    projectId: string;
    period: string;
    baseAmount: number;
    voAmount?: number;
    submittedBy: string;
}

export class CertifyClaimDto {
    certifiedAmount: number;
}

export class CreateVODto {
    projectId: string;
    voNumber: string;
    title: string;
    description: string;
    costImpact: number;
    timeImpact?: number;
}

@Controller('construction/claims')
@UseGuards(JwtAuthGuard)
export class ClaimController {
    constructor(private readonly claimService: ClaimService) { }

    @Post()
    async createClaim(@Body() dto: CreateClaimDto) {
        return this.claimService.createClaim(dto);
    }

    @Patch(':id/submit')
    async submitClaim(@Param('id') id: string) {
        return this.claimService.submitClaim(id);
    }

    @Patch(':id/certify')
    async certifyClaim(@Param('id') id: string, @Body() dto: CertifyClaimDto) {
        return this.claimService.certifyClaim(id, dto.certifiedAmount);
    }

    @Get('project/:projectId')
    async getClaims(@Param('projectId') projectId: string) {
        return this.claimService.getClaims(projectId);
    }

    @Get('project/:projectId/summary')
    async getClaimSummary(@Param('projectId') projectId: string) {
        return this.claimService.getClaimSummary(projectId);
    }

    @Post('vo')
    async createVO(@Body() dto: CreateVODto) {
        return this.claimService.createVO(dto);
    }

    @Patch('vo/:id/status')
    async updateVOStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.claimService.updateVOStatus(id, status);
    }

    @Get('vo/:projectId')
    async getVOs(@Param('projectId') projectId: string) {
        return this.claimService.getVOs(projectId);
    }
}
