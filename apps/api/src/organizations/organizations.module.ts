import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InvitationsService } from './invitations.service';
import { EmailService } from '../common/services/email.service';

@Module({
    imports: [PrismaModule],
    controllers: [OrganizationsController],
    providers: [OrganizationsService, InvitationsService, EmailService],
})
export class OrganizationsModule { }
