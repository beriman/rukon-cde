import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSiteCaptureDto {
    @IsString()
    projectId: string;

    @IsOptional()
    @IsString()
    drawingId?: string;

    @IsString()
    captureType: 'PHOTO' | 'VIDEO' | 'VOICE_NOTE';

    @IsOptional()
    @IsString()
    fileUrl?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    altitude?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    gpsAccuracy?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    pinX?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    pinY?: number;

    @IsOptional()
    @IsString()
    commentary?: string;

    @IsOptional()
    @IsString()
    voiceNoteUrl?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    voiceNoteDurationSec?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    fileSizeBytes?: number;

    @IsOptional()
    @IsString()
    mimeType?: string;

    @IsOptional()
    @IsDateString()
    capturedAt?: string;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class UpdateSiteCaptureDto {
    @IsOptional()
    @IsString()
    drawingId?: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    pinX?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    pinY?: number;

    @IsOptional()
    @IsString()
    commentary?: string;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class QuerySiteCaptureDto {
    @IsOptional()
    @IsString()
    projectId?: string;

    @IsOptional()
    @IsString()
    drawingId?: string;

    @IsOptional()
    @IsString()
    captureType?: 'PHOTO' | 'VIDEO' | 'VOICE_NOTE';

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    synced?: boolean;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    offset?: number;
}
