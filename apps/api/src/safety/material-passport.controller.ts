import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaterialPassportService } from './material-passport.service';

@ApiTags('Material Passport')
@ApiBearerAuth()
@Controller('material-passports')
export class MaterialPassportController {
    constructor(private readonly materialPassportService: MaterialPassportService) { }

    @Get()
    @ApiOperation({ summary: 'List material passports' })
    async findAll(@Query('projectId') projectId?: string) {
        return this.materialPassportService.findAll(projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get material passport by ID' })
    async findOne(@Param('id') id: string) {
        return this.materialPassportService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create material passport' })
    async create(@Body() createDto: any) {
        return this.materialPassportService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update material passport' })
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.materialPassportService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete material passport' })
    async delete(@Param('id') id: string) {
        return this.materialPassportService.delete(id);
    }
}
