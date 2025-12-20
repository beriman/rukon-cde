import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportAggregatorService } from './report-aggregator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ReportController],
    providers: [ReportService, ReportAggregatorService],
    exports: [ReportService],
})
export class ReportModule { }
