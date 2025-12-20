import {
    Controller,
    Get,
    Query,
    BadRequestException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QrService } from './qr.service';
import { LookupQrDto } from './qr.dto';

@Controller('qr')
@UseGuards(JwtAuthGuard)
export class QrController {
    constructor(private readonly qrService: QrService) { }

    /**
     * Lookup asset/room by QR code
     * Format: rukon://asset/{assetId} or rukon://room/{roomId}
     */
    @Get('lookup')
    async lookup(@Query() query: LookupQrDto) {
        if (!query.code) {
            throw new BadRequestException('QR code is required');
        }

        const result = await this.qrService.lookup(query.code);

        if (!result) {
            throw new NotFoundException('Resource not found for this QR code');
        }

        return result;
    }

    /**
     * Generate QR code data for an asset or room
     */
    @Get('generate')
    async generateCode(
        @Query('type') type: 'asset' | 'room',
        @Query('id') id: string,
    ) {
        if (!type || !id) {
            throw new BadRequestException('Type and ID are required');
        }

        return this.qrService.generateQrData(type, id);
    }
}
