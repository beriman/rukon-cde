import { Module } from '@nestjs/common';
import { RiskRegisterController } from './risk-register.controller';
import { RiskRegisterService } from './risk-register.service';
import { SafetyTagController } from './safety-tag.controller';
import { SafetyTagService } from './safety-tag.service';
import { HazmatController } from './hazmat.controller';
import { HazmatService } from './hazmat.service';
import { MaterialPassportController } from './material-passport.controller';
import { MaterialPassportService } from './material-passport.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [
        RiskRegisterController,
        SafetyTagController,
        HazmatController,
        MaterialPassportController,
    ],
    providers: [
        RiskRegisterService,
        SafetyTagService,
        HazmatService,
        MaterialPassportService,
    ],
    exports: [RiskRegisterService, HazmatService],
})
export class SafetyModule { }
