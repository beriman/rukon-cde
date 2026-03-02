import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransmittalDto } from './dto/create-transmittal.dto';

@Injectable()
export class TransmittalsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransmittalDto: CreateTransmittalDto, senderId: string) {
    const { projectId, subject, message, recipientIds, fileIds } = createTransmittalDto;

    // Generate Transmittal No
    const count = await this.prisma.transmittal.count({
      where: { projectId },
    });
    const year = new Date().getFullYear();
    const sequence = String(count + 1).padStart(4, '0');
    const transmittalNo = `TR-${year}-${sequence}`;

    return this.prisma.transmittal.create({
      data: {
        transmittalNo,
        subject,
        message,
        projectId,
        senderId,
        status: 'SENT', // Auto-send for now
        sentAt: new Date(),
        recipients: {
          create: recipientIds.map((id) => ({
            recipientId: id,
          })),
        },
        items: {
          create: fileIds.map((id) => ({
            fileId: id,
            purpose: 'For Information', // Default
          })),
        },
      },
      include: {
        recipients: { include: { recipient: true } },
        items: { include: { file: true } },
      },
    });
  }

  async findAll(projectId: string) {
    return this.prisma.transmittal.findMany({
      where: { projectId },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { items: true, recipients: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const transmittal = await this.prisma.transmittal.findUnique({
      where: { id },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        },
        recipients: { 
          include: { 
            recipient: { select: { id: true, name: true, email: true } } 
          } 
        },
        items: { 
          include: { 
            file: { select: { id: true, name: true, originalName: true, mimeType: true } } 
          } 
        },
      },
    });
    if (!transmittal) throw new NotFoundException('Transmittal not found');
    return transmittal;
  }
}
