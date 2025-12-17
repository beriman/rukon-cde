import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { LoinService, ElementData } from './loin.service';

@Controller('loin')
export class LoinController {
    constructor(private readonly loinService: LoinService) { }

    @Post('spec')
    async createSpec(@Body() body: { projectId: string; name: string; description?: string }) {
        return this.loinService.createSpec(body.projectId, body.name, body.description);
    }

    @Get('project/:projectId/specs')
    async getProjectSpecs(@Param('projectId') projectId: string) {
        return this.loinService.getSpecs(projectId);
    }

    @Get('spec/:id')
    async getSpec(@Param('id') id: string) {
        return this.loinService.getSpec(id);
    }

    @Post('rule')
    async createRule(@Body() body: {
        specId: string;
        ifcEntity: string;
        propertySet: string;
        property: string;
        requirement: string;
        value?: string;
    }) {
        return this.loinService.createRule(body.specId, body);
    }

    @Delete('rule/:id')
    async deleteRule(@Param('id') id: string) {
        return this.loinService.deleteRule(id);
    }

    @Post('validate')
    async validate(@Body() body: { projectId: string; elements: ElementData[] }) {
        return this.loinService.validateModel(body.projectId, body.elements);
    }
}
