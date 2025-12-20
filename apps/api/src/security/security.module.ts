import { Module } from '@nestjs/common';
import { SensitivityController } from './sensitivity.controller';
import { SensitivityService } from './sensitivity.service';
import { RedactionController } from './redaction.controller';
import { RedactionService } from './redaction.service';
import { WatermarkController } from './watermark.controller';
import { WatermarkService } from './watermark.service';
import { AuditTrailController } from './audit-trail.controller';
import { AuditTrailService } from './audit-trail.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [
        SensitivityController,
        RedactionController,
        WatermarkController,
        AuditTrailController,
    ],
    providers: [
        SensitivityService,
        RedactionService,
        WatermarkService,
        AuditTrailService,
    ],
    exports: [
        SensitivityService,
        AuditTrailService,
    ],
})
export class SecurityModule { }
