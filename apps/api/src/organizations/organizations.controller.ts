import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { InvitationsService } from './invitations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrgDto } from './dto/create-org.dto';

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
        @Body() body: { email: string; role?: string },
    ) {
        return this.invitationsService.create(
            organizationId,
            body.email,
            body.role,
            req.user.userId,
        );
    }

    @Get('invitations/verify/:token')
    verifyInvitation(@Param('token') token: string) {
        return this.invitationsService.verifyToken(token);
    }

    @Post('invitations/accept/:token')
    acceptInvitation(@Request() req, @Param('token') token: string) {
        return this.invitationsService.acceptInvitation(token, req.user.userId);
    }
}
