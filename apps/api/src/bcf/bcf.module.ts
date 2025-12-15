import { Module } from '@nestjs/common';
import { BcfController } from './bcf.controller';
import { BcfService } from './bcf.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BcfController],
  providers: [BcfService]
})
export class BcfModule { }
