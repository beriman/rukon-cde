import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MeetingService, CreateMeetingDto, CreateActionItemDto, UpdateActionItemDto } from './meeting.service';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingController {
    constructor(private readonly meetingService: MeetingService) { }

    // ===== MEETINGS =====

    @Post()
    async create(@Body() dto: CreateMeetingDto, @CurrentUser() user: any) {
        return this.meetingService.createMeeting(dto, user.id);
    }

    @Get()
    async list(@Query('projectId') projectId: string) {
        return this.meetingService.listMeetings(projectId);
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        return this.meetingService.getMeeting(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: Partial<CreateMeetingDto>) {
        return this.meetingService.updateMeeting(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.meetingService.deleteMeeting(id);
    }

    // ===== ACTION ITEMS =====

    @Post(':meetingId/actions')
    async createAction(
        @Param('meetingId') meetingId: string,
        @Body() dto: Omit<CreateActionItemDto, 'meetingId'>,
    ) {
        return this.meetingService.createActionItem({ ...dto, meetingId });
    }

    @Put('actions/:id')
    async updateAction(@Param('id') id: string, @Body() dto: UpdateActionItemDto) {
        return this.meetingService.updateActionItem(id, dto);
    }

    @Delete('actions/:id')
    async deleteAction(@Param('id') id: string) {
        return this.meetingService.deleteActionItem(id);
    }

    @Get('my-actions')
    async getMyActions(@CurrentUser() user: any, @Query('projectId') projectId?: string) {
        return this.meetingService.getMyActionItems(user.id, projectId);
    }

    // ===== CARRY OVER =====

    @Get(':id/open-items')
    async getOpenItems(@Param('id') id: string) {
        return this.meetingService.getOpenItemsFromMeeting(id);
    }

    @Post(':toMeetingId/carry-over')
    async carryOver(
        @Param('toMeetingId') toMeetingId: string,
        @Body() body: { fromMeetingId: string; itemIds: string[] },
    ) {
        return this.meetingService.carryOverItems(body.fromMeetingId, toMeetingId, body.itemIds);
    }

    // ===== EXPORT =====

    @Get(':id/export')
    async exportMeeting(@Param('id') id: string) {
        return this.meetingService.getMeetingForExport(id);
    }
}
