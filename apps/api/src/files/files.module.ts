import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FilesWorkflowController } from './files-workflow.controller';
import { SigningController } from './signing.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConversionService } from '../common/services/conversion.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';

@Module({
    imports: [],
    controllers: [FilesController, FilesWorkflowController, SigningController],
    providers: [FilesService, PrismaService, ConversionService, NamingConventionService, AuditService],
    exports: [FilesService],
})
export class FilesModule { }
