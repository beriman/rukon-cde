import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SiteCaptureService } from './site-capture.service';
import { CreateSiteCaptureDto, UpdateSiteCaptureDto, QuerySiteCaptureDto } from './site-capture.dto';

@Controller('site-captures')
@UseGuards(JwtAuthGuard)
export class SiteCaptureController {
    constructor(private readonly siteCaptureService: SiteCaptureService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @UploadedFile() file: any,
        @Body() dto: CreateSiteCaptureDto,
        @CurrentUser() user: any,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.siteCaptureService.create(dto, file, user.id);
    }

    @Get()
    async findAll(
        @Query() query: QuerySiteCaptureDto,
        @CurrentUser() user: any,
    ) {
        return this.siteCaptureService.findAll(query, user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.siteCaptureService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateSiteCaptureDto,
        @CurrentUser() user: any,
    ) {
        return this.siteCaptureService.update(id, dto, user.id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return this.siteCaptureService.delete(id, user.id);
    }

    @Post('batch')
    async createBatch(
        @Body() captures: CreateSiteCaptureDto[],
        @CurrentUser() user: any,
    ) {
        return this.siteCaptureService.createBatch(captures, user.id);
    }

    @Get('project/:projectId/stats')
    async getProjectStats(@Param('projectId') projectId: string) {
        return this.siteCaptureService.getProjectStats(projectId);
    }

    @Get('drawing/:drawingId/pins')
    async getDrawingPins(@Param('drawingId') drawingId: string) {
        return this.siteCaptureService.getDrawingPins(drawingId);
    }
}
