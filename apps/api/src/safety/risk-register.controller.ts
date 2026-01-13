import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RiskRegisterService } from './risk-register.service';

@ApiTags('Risk Register')
@ApiBearerAuth()
@Controller('risk-register')
export class RiskRegisterController {
    constructor(private readonly riskRegisterService: RiskRegisterService) { }

    @Get()
    @ApiOperation({ summary: 'List risk entries' })
    async findAll(@Query('projectId') projectId?: string) {
        return this.riskRegisterService.findAll(projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get risk entry by ID' })
    async findOne(@Param('id') id: string) {
        return this.riskRegisterService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create risk entry' })
    async create(@Body() createDto: any) {
        return this.riskRegisterService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update risk entry' })
    async update(@Param('id') id: string, @Body() updateDto: any) {
        return this.riskRegisterService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete risk entry' })
    async delete(@Param('id') id: string) {
        return this.riskRegisterService.delete(id);
    }
}
