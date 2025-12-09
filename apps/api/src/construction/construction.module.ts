import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConstructionController } from './construction.controller';
import { ProgressService } from './progress.service';
import { SubmittalService } from './submittal.service';
import { SubmittalController } from './submittal.controller';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { CobieService } from './cobie.service';
import { CorrespondenceService } from './correspondence.service';

@Module({
    imports: [PrismaModule],
    controllers: [
        ConstructionController,
        SubmittalController,
        ProcurementController,
        ClaimController,
    ],
    providers: [
        ProgressService,
        SubmittalService,
        ProcurementService,
        ClaimService,
        CobieService,
        CorrespondenceService,
    ],
    exports: [
        ProgressService,
        SubmittalService,
        ProcurementService,
        ClaimService,
        CobieService,
        CorrespondenceService,
    ],
})
export class ConstructionModule { }
