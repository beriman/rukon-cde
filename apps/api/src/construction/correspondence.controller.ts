import { Body, Controller, Get, Param, Post, Request, UseGuards, Query, Patch } from '@nestjs/common';
import { CorrespondenceService } from './correspondence.service';
import { AuthGuard } from '@nestjs/passport';

export class CreateCorrespondenceDto {
    projectId: string;
    type: string; // e.g., 'SITE_MEMO', 'SITE_INSTRUCTION'
    subject: string;
    message: string;
    to: string[]; // Recipient names?
    category?: 'GENERAL' | 'OFFICIAL_LETTER';
    attachments?: string[];
}

@Controller('construction/correspondence')
// @UseGuards(AuthGuard('jwt')) 
// Assuming global auth or imported guard. ConstructionController uses commented out guard.
// Use 'jwt' for now as standard.
@UseGuards(AuthGuard('jwt'))
export class CorrespondenceController {
    constructor(private readonly correspondenceService: CorrespondenceService) { }

    @Post()
    create(@Request() req, @Body() dto: CreateCorrespondenceDto) {
        return this.correspondenceService.create({
            ...dto,
            from: req.user.username || req.user.email || 'Unknown', // Need to check what req.user provides
            userId: req.user.userId
        });
    }

    @Get('project/:projectId')
    findAll(@Param('projectId') projectId: string, @Query('type') type?: string) {
        return this.correspondenceService.getCorrespondences(projectId, type);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.correspondenceService.getById(id);
    }

    @Post(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.correspondenceService.markAsRead(id);
    }

    @Patch(':id/approve')
    approve(@Param('id') id: string, @Request() req) {
        // req.user from JwtStrategy usually has id or userId.
        // UsersController uses user.id. We will try user.id.
        return this.correspondenceService.approve(id, req.user.id || req.user.userId);
    }
}

