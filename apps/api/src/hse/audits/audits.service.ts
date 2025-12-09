import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuditDto, UpdateFindingDto, CreateEmergencyContactDto } from './dto/audit.dto';

@Injectable()
export class AuditsService {
    constructor(private prisma: PrismaService) { }

    // Audits
    async createAudit(projectId: string, dto: CreateAuditDto) {
        return this.prisma.hseAudit.create({
            data: {
                projectId,
                auditDate: new Date(dto.auditDate),
                auditor: dto.auditor,
                scope: dto.scope,
                findings: {
                    create: dto.findings,
                },
            },
            include: { findings: true },
        });
    }

    async findAllAudits(projectId: string) {
        return this.prisma.hseAudit.findMany({
            where: { projectId },
            include: { findings: true },
            orderBy: { auditDate: 'desc' },
        });
    }

    async updateFinding(id: string, dto: UpdateFindingDto) {
        return this.prisma.hseAuditFinding.update({
            where: { id },
            data: {
                ...dto,
                responseDate: dto.responseDate ? new Date(dto.responseDate) : undefined,
            },
        });
    }

    // Emergency Contacts
    async createContact(projectId: string, dto: CreateEmergencyContactDto) {
        return this.prisma.hseEmergencyContact.create({
            data: {
                projectId,
                ...dto,
            },
        });
    }

    async findAllContacts(projectId: string) {
        return this.prisma.hseEmergencyContact.findMany({
            where: { projectId },
            orderBy: [{ isPrimary: 'desc' }, { name: 'asc' }],
        });
    }
}
