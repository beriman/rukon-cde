import { Controller, Get, Patch, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Get user notifications' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'Returns paginated notifications' })
    findAll(
        @Request() req,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('unreadOnly') unreadOnly?: string,
    ) {
        return this.notificationsService.findAllByUser(req.user.userId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            unreadOnly: unreadOnly === 'true',
        });
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    markAsRead(@Request() req, @Param('id') id: string) {
        return this.notificationsService.markAsRead(id, req.user.userId);
    }

    @Patch('read-all')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({ status: 200, description: 'All notifications marked as read' })
    markAllAsRead(@Request() req) {
        return this.notificationsService.markAllAsRead(req.user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete notification' })
    @ApiResponse({ status: 200, description: 'Notification deleted' })
    delete(@Request() req, @Param('id') id: string) {
        return this.notificationsService.deleteNotification(id, req.user.userId);
    }
}
