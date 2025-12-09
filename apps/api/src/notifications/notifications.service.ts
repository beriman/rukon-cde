import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateNotificationDto {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    channel?: string;
}

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateNotificationDto) {
        return this.prisma.notification.create({
            data: {
                userId: dto.userId,
                type: dto.type,
                title: dto.title,
                message: dto.message,
                data: dto.data || null,
                channel: dto.channel || 'IN_APP',
            },
        });
    }

    async findAllByUser(
        userId: string,
        options: { page?: number; limit?: number; unreadOnly?: boolean } = {},
    ) {
        const { page = 1, limit = 50, unreadOnly = false } = options;

        const where = {
            userId,
            ...(unreadOnly && { read: false }),
        };

        const [notifications, total, unreadCount] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.notification.count({ where }),
            this.prisma.notification.count({
                where: { userId, read: false },
            }),
        ]);

        return {
            data: notifications,
            meta: {
                total,
                unreadCount,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async markAsRead(id: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: { id, userId },
            data: { read: true },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }

    async deleteNotification(id: string, userId: string) {
        return this.prisma.notification.deleteMany({
            where: { id, userId },
        });
    }

    // Helper method for other services to send notifications
    async notify(userId: string, type: string, title: string, message: string, data?: any) {
        return this.create({
            userId,
            type,
            title,
            message,
            data,
            channel: 'IN_APP',
        });
    }
}
