import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssetService } from './asset.service';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetController {
    constructor(private readonly assetService: AssetService) { }

    @Get()
    @ApiOperation({ summary: 'List all assets' })
    async findAll(@Query('projectId') projectId?: string) {
        return this.assetService.findAll(projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get asset by ID' })
    async findOne(@Param('id') id: string) {
        return this.assetService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new asset' })
    async create(@Body() createDto: any) {
        return this.assetService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update asset' })
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.assetService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete asset' })
    async delete(@Param('id') id: string) {
        return this.assetService.delete(id);
    }
}
