import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(
        @Query('organizationId') organizationId: string,
        @Query('search') search?: string,
        @Query('role') role?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.usersService.findAll(organizationId, {
            search,
            role,
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }

    @Patch(':id/role')
    updateRole(@Param('id') id: string, @Body() body: { role: string }) {
        return this.usersService.updateRole(id, body.role);
    }

    @Delete(':id')
    deactivate(@Param('id') id: string) {
        return this.usersService.deactivate(id);
    }
}
