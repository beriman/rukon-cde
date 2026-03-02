import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects/:projectId/assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}

    @Post()
    create(@Param('projectId') projectId: string, @Body() createAssetDto: CreateAssetDto) {
        return this.assetsService.create(projectId, createAssetDto);
    }

    @Get()
    findAll(@Param('projectId') projectId: string) {
        return this.assetsService.findAll(projectId);
    }

    @Get('by-guid')
    findByGuid(@Param('projectId') projectId: string, @Query('guid') guid: string) {
        return this.assetsService.findByGuid(projectId, guid);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.assetsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAssetDto: any) {
        return this.assetsService.update(id, updateAssetDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.assetsService.remove(id);
    }
}
