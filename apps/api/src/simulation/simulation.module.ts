import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { CashFlowService } from './cash-flow.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService, CashFlowService, PrismaService],
})
export class SimulationModule { }
