import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenderController } from './tender.controller';
import { DataRoomService } from './data-room.service';

@Module({
    imports: [PrismaModule],
    controllers: [TenderController],
    providers: [DataRoomService],
    exports: [DataRoomService],
})
export class TenderModule { }
