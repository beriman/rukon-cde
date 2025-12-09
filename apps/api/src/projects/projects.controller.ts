import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { FoldersService } from './folders.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly foldersService: FoldersService,
    ) { }

    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    @Get()
    findAll(
        @Query('organizationId') organizationId: string,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    ) {
        return this.projectsService.findAll(organizationId, {
            search,
            status,
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            sortBy,
            sortOrder,
        });
    }

    @Post('folders')
    createFolder(@Body() createFolderDto: CreateFolderDto) {
        return this.foldersService.create(createFolderDto);
    }

    @Get(':id/folders')
    getFolderTree(@Param('id') projectId: string, @Query('userId') userIdQuery?: string, @Req() req?: any) {
        // Fallback for mock/test if req.user is missing, though Guard should handle it
        const userId = req?.user?.id || userIdQuery || 'system-test-user';
        return this.foldersService.getFolderTree(projectId, userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: { name?: string; code?: string }) {
        return this.projectsService.update(id, data);
    }

    @Patch(':id/archive')
    archive(@Param('id') id: string) {
        return this.projectsService.archive(id);
    }
}
