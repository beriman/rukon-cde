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
import { ApprovalService } from './approval.service';
import { FilesModule } from '../files/files.module';
import { PdfService } from '../common/services/pdf.service';
import { CorrespondenceController } from './correspondence.controller';

@Module({
    imports: [PrismaModule, FilesModule],
    controllers: [
        ConstructionController,
        SubmittalController,
        ProcurementController,
        ClaimController,
        CorrespondenceController,
    ],
    providers: [
        ProgressService,
        SubmittalService,
        ProcurementService,
        ClaimService,
        CobieService,
        CorrespondenceService,
        CorrespondenceService,
        ApprovalService,
        PdfService,
    ],
    exports: [
        ProgressService,
        SubmittalService,
        ProcurementService,
        ClaimService,
        CobieService,
        CorrespondenceService,
        ApprovalService,
    ],
})
export class ConstructionModule { }
