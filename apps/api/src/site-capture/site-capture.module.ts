import { Module } from '@nestjs/common';
import { SiteCaptureController } from './site-capture.controller';
import { SiteCaptureService } from './site-capture.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SiteCaptureController],
    providers: [SiteCaptureService],
    exports: [SiteCaptureService],
})
export class SiteCaptureModule { }
