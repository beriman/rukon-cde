import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { SimulationService } from './simulation.service';
import { CashFlowService, DailyCashFlow } from './cash-flow.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { LinkElementDto } from './dto/link-element.dto';

@Controller('simulation')
export class SimulationController {
    constructor(
        private readonly simulationService: SimulationService,
        private readonly cashFlowService: CashFlowService,
    ) { }

    @Post('schedule/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSchedule(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateScheduleDto
    ) {
        return this.simulationService.uploadSchedule(file, body);
    }

    @Post('link')
    async linkElement(@Body() dto: LinkElementDto) {
        return this.simulationService.linkTaskToElement(dto);
    }

    @Get('project/:projectId/schedules')
    async getProjectSchedules(@Param('projectId') projectId: string) {
        return this.simulationService.getProjectSchedules(projectId);
    }

    @Get('schedule/:id/cash-flow')
    async getCashFlow(@Param('id') id: string) {
        return this.cashFlowService.getProjectCashFlow(id);
    }

    @Get('schedule/:id/cash-flow/csv')
    async exportCashFlowCsv(@Param('id') id: string, @Res() res: Response) {
        const csv = await this.cashFlowService.getCashFlowCsv(id);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="cash-flow-${id}.csv"`);
        res.send(csv);
    }
}
