import { Module } from '@nestjs/common';
import { HseController } from './hse.controller';
import { HseService } from './hse.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IncidentsModule } from './incidents/incidents.module';
import { InspectionsModule } from './inspections/inspections.module';
import { PersonnelModule } from './personnel/personnel.module';
import { AuditsModule } from './audits/audits.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
    imports: [PrismaModule, IncidentsModule, InspectionsModule, PersonnelModule, AuditsModule, TemplatesModule],
    controllers: [HseController],
    providers: [HseService],
    exports: [HseService],
})
export class HseModule { }
