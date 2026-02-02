import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FilesWorkflowController } from './files-workflow.controller';
import { SigningController } from './signing.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CommonModule } from '../common/common.module';
import { ConversionService } from '../common/services/conversion.service';

@Module({
    imports: [CommonModule],
    controllers: [FilesController, FilesWorkflowController, SigningController],
    providers: [FilesService, PrismaService, ConversionService],
    exports: [FilesService],
})
export class FilesModule { }
