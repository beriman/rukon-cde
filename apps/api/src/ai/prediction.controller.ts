import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PredictionService } from './prediction.service';

@Controller('ai/predictions')
@UseGuards(JwtAuthGuard)
export class PredictionController {
    constructor(private readonly predictionService: PredictionService) { }

    @Get('delay/:projectId')
    async getDelayPrediction(@Param('projectId') projectId: string) {
        return this.predictionService.predictDelay(projectId);
    }
}
