import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { FoldersService } from './folders.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ProjectsController],
    providers: [ProjectsService, FoldersService],
    exports: [ProjectsService, FoldersService],
})
export class ProjectsModule { }
