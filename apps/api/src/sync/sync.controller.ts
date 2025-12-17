import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Get('pull')
    async pullChanges(
        @Query('projectId') projectId: string,
        @Query('lastSync') lastSync: string,
        @CurrentUser() user: any,
    ) {
        const lastSyncDate = lastSync ? new Date(lastSync) : new Date(0);
        return this.syncService.pullChanges(projectId, lastSyncDate, user.id);
    }

    @Post('push')
    async pushChanges(
        @Body() body: { projectId: string; changes: any },
        @CurrentUser() user: any,
    ) {
        return this.syncService.pushChanges(body.projectId, body.changes, user.id);
    }
}
