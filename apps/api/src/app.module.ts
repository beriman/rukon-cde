import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { FilesModule } from './files/files.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { AuditModule } from './common/audit/audit.module';
import { PlanningModule } from './planning/planning.module';
import { DesignModule } from './design/design.module';
import { HseModule } from './hse/hse.module';
import { ConstructionModule } from './construction/construction.module';
import { UploadModule } from './upload/upload.module';
import { BimModule } from './bim/bim.module';
import { BcfModule } from './bcf/bcf.module';
import { SmartReviewModule } from './smart-review/smart-review.module';
import { SimulationModule } from './simulation/simulation.module';
import { CostModule } from './cost/cost.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10,
        }]),
        PrismaModule,
        AuthModule,
        UsersModule,
        OrganizationsModule,
        ProjectsModule,
        FilesModule,
        NotificationsModule,
        AuditModule,
        PlanningModule,
        DesignModule,
        HseModule,
        ConstructionModule,
        UploadModule,
        BimModule,
        BcfModule,
        SmartReviewModule,
        SimulationModule,
        CostModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
