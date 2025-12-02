import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
    imports: [AuthModule, PrismaModule, OrganizationsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
