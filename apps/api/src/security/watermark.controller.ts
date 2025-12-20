import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WatermarkService, WatermarkConfig } from './watermark.service';

@Controller('security/watermark')
@UseGuards(JwtAuthGuard)
export class WatermarkController {
    constructor(private readonly watermarkService: WatermarkService) { }

    @Get('config/:organizationId')
    async getConfig(@Param('organizationId') organizationId: string) {
        return this.watermarkService.getConfig(organizationId);
    }

    @Put('config/:organizationId')
    async updateConfig(
        @Param('organizationId') organizationId: string,
        @Body() config: Partial<WatermarkConfig>,
    ) {
        return this.watermarkService.updateConfig(organizationId, config);
    }

    @Get('overlay/:organizationId')
    async getOverlay(
        @Param('organizationId') organizationId: string,
        @CurrentUser() user: any,
    ) {
        return this.watermarkService.generateWatermarkOverlay(organizationId, user.name || user.email);
    }
}
