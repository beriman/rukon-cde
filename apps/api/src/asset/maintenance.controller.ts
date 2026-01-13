import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';

@ApiTags('Maintenance')
@ApiBearerAuth()
@Controller('maintenance')
export class MaintenanceController {
    constructor(private readonly maintenanceService: MaintenanceService) { }

    @Get()
    @ApiOperation({ summary: 'List all maintenance schedules' })
    async findAll(@Query('assetId') assetId?: string) {
        return this.maintenanceService.findAll(assetId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get maintenance schedule by ID' })
    async findOne(@Param('id') id: string) {
        return this.maintenanceService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create maintenance schedule' })
    async create(@Body() createDto: any) {
        return this.maintenanceService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update maintenance schedule' })
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.maintenanceService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete maintenance schedule' })
    async delete(@Param('id') id: string) {
        return this.maintenanceService.delete(id);
    }
}
