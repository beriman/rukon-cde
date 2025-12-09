import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from '../inspections/dto/inspection.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class MeetingsController {
    constructor(private readonly meetingsService: MeetingsService) { }

    @Post('projects/:projectId/meetings')
    create(
        @Param('projectId') projectId: string,
        @Body() dto: CreateMeetingDto,
    ) {
        return this.meetingsService.create(projectId, dto);
    }

    @Get('projects/:projectId/meetings')
    findAll(@Param('projectId') projectId: string) {
        return this.meetingsService.findAll(projectId);
    }
}
