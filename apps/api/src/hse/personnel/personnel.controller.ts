import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/personnel.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class PersonnelController {
    constructor(private readonly personnelService: PersonnelService) { }

    @Post('projects/:projectId/personnel')
    create(
        @Param('projectId') projectId: string,
        @Body() dto: CreatePersonnelDto,
    ) {
        return this.personnelService.create(projectId, dto);
    }

    @Get('projects/:projectId/personnel')
    findAll(@Param('projectId') projectId: string) {
        return this.personnelService.findAll(projectId);
    }

    @Get('personnel/:id')
    findOne(@Param('id') id: string) {
        return this.personnelService.findOne(id);
    }

    @Patch('personnel/:id')
    update(@Param('id') id: string, @Body() dto: Partial<CreatePersonnelDto>) {
        return this.personnelService.update(id, dto);
    }

    @Delete('personnel/:id')
    remove(@Param('id') id: string) {
        return this.personnelService.remove(id);
    }
}
