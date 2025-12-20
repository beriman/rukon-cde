import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { HandoverController } from './handover.controller';
import { HandoverService } from './handover.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AssetController, MaintenanceController, HandoverController],
    providers: [AssetService, MaintenanceService, HandoverService],
    exports: [AssetService, MaintenanceService],
})
export class AssetModule { }
