import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HseService } from './hse.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects/:projectId/hse')
@UseGuards(JwtAuthGuard)
export class HseController {
    constructor(private readonly hseService: HseService) { }

    @Get('stats')
    async getStats(@Param('projectId') projectId: string) {
        return this.hseService.getStats(projectId);
    }
}
