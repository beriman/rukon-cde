import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Query, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GlobalRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me/dashboard')
    getDashboardData(@CurrentUser() user: any) {
        return this.usersService.getDashboardData(user.id);
    }

    @Get('me/profile')
    getProfile(@CurrentUser() user: any) {
        return this.usersService.findOneById(user.id);
    }

    @Patch('me/profile')
    updateProfile(@CurrentUser() user: any, @Body() body: { name?: string; phone?: string; address?: string }) {
        return this.usersService.updateProfile(user.id, body);
    }

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
    @Roles(GlobalRole.SUPER_ADMIN)
    updateRole(@Param('id') id: string, @Body() body: { role: string }) {
        return this.usersService.updateRole(id, body.role);
    }

    @Delete(':id')
    @Roles(GlobalRole.SUPER_ADMIN)
    deactivate(@Param('id') id: string) {
        return this.usersService.deactivate(id);
    }
    @Post('me/signature')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSignature(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.uploadSignature(user.id, file);
    }
}
