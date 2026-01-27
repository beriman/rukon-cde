import { Controller, Get, Post, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationsService } from './organizations.service';
import { InvitationsService } from './invitations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrgDto } from './dto/create-org.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'))
export class OrganizationsController {
    constructor(
        private readonly organizationsService: OrganizationsService,
        private readonly invitationsService: InvitationsService,
    ) { }

    @Post()
    create(@Request() req, @Body() dto: CreateOrgDto) {
        return this.organizationsService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Request() req) {
        return this.organizationsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.organizationsService.findOne(id, req.user.userId);
    }

    @Post(':id/invitations')
    sendInvitation(
        @Request() req,
        @Param('id') organizationId: string,
        @Body() dto: InviteUserDto,
    ) {
        return this.invitationsService.create(
            organizationId,
            dto.email,
            dto.role,
            req.user.userId,
        );
    }

    @Public()
    @Get('invitations/verify/:token')
    verifyInvitation(@Param('token') token: string) {
        return this.invitationsService.verifyToken(token);
    }

    @Post('invitations/accept/:token')
    acceptInvitation(@Request() req, @Param('token') token: string) {
        return this.invitationsService.acceptInvitation(token, req.user.userId);
    }
    @Post(':id/letterhead')
    @UseInterceptors(FileInterceptor('file'))
    async uploadLetterhead(
        @Request() req,
        @Param('id') id: string,
        @Query('type') type: 'header' | 'footer',
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.organizationsService.uploadLetterhead(req.user.userId, id, type, file);
    }
}
