import { Module } from '@nestjs/common';
import { BimService } from './bim.service';
import { BimController } from './bim.controller';
import { FilesModule } from '../files/files.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [FilesModule, PrismaModule],
  controllers: [BimController],
  providers: [BimService],
})
export class BimModule { }
