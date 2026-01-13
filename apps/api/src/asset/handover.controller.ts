import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HandoverService } from './handover.service';

@ApiTags('Handover')
@ApiBearerAuth()
@Controller('handover')
export class HandoverController {
    constructor(private readonly handoverService: HandoverService) { }

    @Get()
    @ApiOperation({ summary: 'List all handover records' })
    async findAll(@Query('projectId') projectId?: string) {
        return this.handoverService.findAll(projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get handover record by ID' })
    async findOne(@Param('id') id: string) {
        return this.handoverService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create handover record' })
    async create(@Body() createDto: any) {
        return this.handoverService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update handover record' })
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.handoverService.update(id, updateDto);
    }
}
