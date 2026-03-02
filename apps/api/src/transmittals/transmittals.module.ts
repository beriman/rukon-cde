import { Module } from '@nestjs/common';
import { TransmittalsService } from './transmittals.service';
import { TransmittalsController } from './transmittals.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransmittalsController],
  providers: [TransmittalsService],
})
export class TransmittalsModule {}
