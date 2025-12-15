import { Module } from '@nestjs/common';
import { SmartReviewController } from './smart-review.controller';
import { SmartReviewService } from './smart-review.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SmartReviewController],
  providers: [SmartReviewService]
})
export class SmartReviewModule { }
