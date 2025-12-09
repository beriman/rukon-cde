import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuditsService } from './audits.service';
import { CreateAuditDto, UpdateFindingDto, CreateEmergencyContactDto } from './dto/audit.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class AuditsController {
    constructor(private readonly auditsService: AuditsService) { }

    // Audits
    @Post('projects/:projectId/audits')
    createAudit(@Param('projectId') projectId: string, @Body() dto: CreateAuditDto) {
        return this.auditsService.createAudit(projectId, dto);
    }

    @Get('projects/:projectId/audits')
    findAllAudits(@Param('projectId') projectId: string) {
        return this.auditsService.findAllAudits(projectId);
    }

    @Patch('audits/findings/:id')
    updateFinding(@Param('id') id: string, @Body() dto: UpdateFindingDto) {
        return this.auditsService.updateFinding(id, dto);
    }

    // Emergency Contacts
    @Post('projects/:projectId/emergency-contacts')
    createContact(@Param('projectId') projectId: string, @Body() dto: CreateEmergencyContactDto) {
        return this.auditsService.createContact(projectId, dto);
    }

    @Get('projects/:projectId/emergency-contacts')
    findAllContacts(@Param('projectId') projectId: string) {
        return this.auditsService.findAllContacts(projectId);
    }
}
