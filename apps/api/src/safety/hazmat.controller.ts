import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HazmatService } from './hazmat.service';

@ApiTags('Hazmat')
@ApiBearerAuth()
@Controller('hazmat')
export class HazmatController {
    constructor(private readonly hazmatService: HazmatService) { }

    @Get()
    @ApiOperation({ summary: 'List hazardous materials' })
    async findAll(@Query('projectId') projectId?: string) {
        return this.hazmatService.findAll(projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get hazmat entry by ID' })
    async findOne(@Param('id') id: string) {
        return this.hazmatService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create hazmat entry' })
    async create(@Body() createDto: any) {
        return this.hazmatService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update hazmat entry' })
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.hazmatService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete hazmat entry' })
    async delete(@Param('id') id: string) {
        return this.hazmatService.delete(id);
    }
}
