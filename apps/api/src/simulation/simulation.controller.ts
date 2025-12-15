import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulationLinkDto } from './dto/create-simulation-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects/:projectId/simulation')
@UseGuards(JwtAuthGuard)
export class SimulationController {
    constructor(private readonly simulationService: SimulationService) { }

    @Post('links')
    create(
        @Param('projectId') projectId: string,
        @Body() dto: CreateSimulationLinkDto
    ) {
        return this.simulationService.createLink(projectId, dto);
    }

    @Get('links')
    findAll(@Param('projectId') projectId: string) {
        return this.simulationService.getLinks(projectId);
    }

    @Delete('links/:id')
    remove(@Param('id') id: string) {
        return this.simulationService.deleteLink(id);
    }
}
