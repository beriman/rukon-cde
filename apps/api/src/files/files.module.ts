import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ReviewsService } from './reviews.service';
import { FilesController } from './files.controller';
import { FilesWorkflowController } from './files-workflow.controller';
import { SigningController } from './signing.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConversionService } from '../common/services/conversion.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';

@Module({
    controllers: [FilesController, FilesWorkflowController, SigningController],
    providers: [FilesService, ReviewsService, PrismaService, ConversionService, NamingConventionService, AuditService],
    exports: [FilesService],
})
export class FilesModule { }
