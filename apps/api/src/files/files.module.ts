import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesWorkflowController } from './files-workflow.controller';
import { FilesController } from './files.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NamingConventionService } from '../common/services/naming-convention.service';

@Module({
    imports: [PrismaModule],
    controllers: [FilesController, FilesWorkflowController],
    providers: [FilesService, NamingConventionService],
    exports: [FilesService],
})
export class FilesModule { }
