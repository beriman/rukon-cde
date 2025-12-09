import { Module } from '@nestjs/common';
import { HseController } from './hse.controller';
import { HseService } from './hse.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IncidentsModule } from './incidents/incidents.module';
import { InspectionsModule } from './inspections/inspections.module';
import { MeetingsModule } from './meetings/meetings.module';
import { PersonnelModule } from './personnel/personnel.module';
import { AuditsModule } from './audits/audits.module';

@Module({
    imports: [PrismaModule, IncidentsModule, InspectionsModule, MeetingsModule, PersonnelModule, AuditsModule],
    controllers: [HseController],
    providers: [HseService],
    exports: [HseService],
})
export class HseModule { }
