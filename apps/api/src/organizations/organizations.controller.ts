import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrgDto } from './dto/create-org.dto';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'))
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

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
}
