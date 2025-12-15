import { Module } from '@nestjs/common';
import { CostService } from './cost.service';
import { CostController } from './cost.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SimulationModule } from '../simulation/simulation.module';

@Module({
    imports: [PrismaModule, SimulationModule], // SimulationModule might be needed if we link to simulation
    controllers: [CostController],
    providers: [CostService],
    exports: [CostService],
})
export class CostModule { }
