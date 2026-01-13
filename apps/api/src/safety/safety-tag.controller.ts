import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SafetyTagService } from './safety-tag.service';

@ApiTags('Safety Tags')
@ApiBearerAuth()
@Controller('safety-tags')
export class SafetyTagController {
    constructor(private readonly safetyTagService: SafetyTagService) { }

    @Get()
    @ApiOperation({ summary: 'List safety tags' })
    async findAll(@Query('projectId') projectId?: string) {
        return this.safetyTagService.findAll(projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get safety tag by ID' })
    async findOne(@Param('id') id: string) {
        return this.safetyTagService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create safety tag' })
    async create(@Body() createDto: any) {
        return this.safetyTagService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update safety tag' })
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.safetyTagService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete safety tag' })
    async delete(@Param('id') id: string) {
        return this.safetyTagService.delete(id);
    }
}
