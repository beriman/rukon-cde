import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BcfService {
    constructor(private prisma: PrismaService) { }

    async createTopic(projectId: string, userId: string, dto: CreateTopicDto) {
        return this.prisma.bcfTopic.create({
            data: {
                projectId,
                title: dto.title,
                description: dto.description,
                priority: dto.priority || 'NORMAL',
                type: dto.type || 'WARNING',
                creationAuthor: userId,
                assignedTo: dto.assignedTo,
                viewpoints: dto.viewpoint ? {
                    create: {
                        eyePosition: dto.viewpoint.eyePosition,
                        direction: dto.viewpoint.direction,
                        upVector: dto.viewpoint.upVector,
                        selection: dto.viewpoint.selection,
                        snapshot: dto.viewpoint.snapshot,
                    }
                } : undefined
            },
            include: {
                viewpoints: true
            }
        });
    }

    async getTopics(projectId: string) {
        return this.prisma.bcfTopic.findMany({
            where: { projectId },
            include: {
                _count: { select: { comments: true } },
                viewpoints: { take: 1 }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getTopic(topicId: string) {
        return this.prisma.bcfTopic.findUnique({
            where: { id: topicId },
            include: {
                comments: {
                    orderBy: { date: 'asc' },
                },
                viewpoints: true
            }
        });
    }

    async addComment(topicId: string, userId: string, dto: CreateCommentDto) {
        return this.prisma.bcfComment.create({
            data: {
                topicId,
                author: userId,
                comment: dto.comment,
                date: new Date(),
                viewpointId: dto.viewpointId
            }
        });
    }

    async updateTopicStatus(topicId: string, status: string) {
        return this.prisma.bcfTopic.update({
            where: { id: topicId },
            data: { status: status as any },
        });
    }
}
