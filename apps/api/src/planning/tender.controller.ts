import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common';
import { DataRoomService } from './data-room.service';

@Controller('tender')
export class TenderController {
    constructor(private readonly dataRoomService: DataRoomService) { }

    @Post('packages')
    create(@Body() dto: any, @Query('projectId') projectId: string) {
        return this.dataRoomService.createPackage(projectId, dto);
    }

    @Get('packages/:id/files')
    getFiles(@Param('id') id: string, @Request() req) {
        const userId = req.user?.userId || 'guest';
        return this.dataRoomService.getFiles(id, userId);
    }

    @Post('packages/:id/invite')
    invite(@Param('id') id: string, @Body('email') email: string) {
        return this.dataRoomService.inviteBidder(id, email);
    }

    @Post('packages/:id/questions')
    postQuestion(@Param('id') id: string, @Body() body: any, @Request() req) {
        return this.dataRoomService.postQuestion(id, req.user?.userId || 'anon', body.question);
    }
}
