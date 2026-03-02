import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { FoldersService } from './folders.service';
import { ProjectsController } from './projects.controller';
import { ProjectsBusinessController } from './projects-business.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../common/audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [PrismaModule, AuditModule, NotificationsModule],
    controllers: [ProjectsController, ProjectsBusinessController],
    providers: [ProjectsService, FoldersService],
    exports: [ProjectsService, FoldersService],
})
export class ProjectsModule { }
