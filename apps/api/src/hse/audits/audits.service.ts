import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuditDto, UpdateFindingDto, CreateEmergencyContactDto } from './dto/audit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditsService {
    constructor(private prisma: PrismaService) { }

    // Audits
    async createAudit(projectId: string, dto: CreateAuditDto) {
        try {
            return await this.prisma.hseAudit.create({
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Project not found');
                }
            }
            console.error('Error creating audit:', error);
            throw new InternalServerErrorException('Failed to create audit');
        }
    }

    async findAllAudits(projectId: string, page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                this.prisma.hseAudit.findMany({
                    where: { projectId },
                    include: { findings: true },
                    orderBy: { auditDate: 'desc' },
                    skip,
                    take: limit,
                }),
                this.prisma.hseAudit.count({ where: { projectId } }),
            ]);

            return {
                data,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error('Error fetching audits:', error);
            throw new InternalServerErrorException('Failed to fetch audits');
        }
    }

    async updateFinding(id: string, dto: UpdateFindingDto) {
        try {
            return await this.prisma.hseAuditFinding.update({
                where: { id },
                data: {
                    ...dto,
                    responseDate: dto.responseDate ? new Date(dto.responseDate) : undefined,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Finding with ID ${id} not found`);
                }
            }
            console.error('Error updating finding:', error);
            throw new InternalServerErrorException('Failed to update finding');
        }
    }

    // Emergency Contacts
    async createContact(projectId: string, dto: CreateEmergencyContactDto) {
        try {
            return await this.prisma.hseEmergencyContact.create({
                data: {
                    projectId,
                    ...dto,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Project not found');
                }
            }
            console.error('Error creating contact:', error);
            throw new InternalServerErrorException('Failed to create emergency contact');
        }
    }

    async findAllContacts(projectId: string) {
        try {
            return await this.prisma.hseEmergencyContact.findMany({
                where: { projectId },
                orderBy: [{ isPrimary: 'desc' }, { name: 'asc' }],
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw new InternalServerErrorException('Failed to fetch emergency contacts');
        }
    }
}
