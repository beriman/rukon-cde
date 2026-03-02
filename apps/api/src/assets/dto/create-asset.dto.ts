import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsJSON } from 'class-validator';
import { AssetStatus } from '@prisma/client';

export class CreateAssetDto {
    @IsString()
    name: string;

    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    tagNumber?: string;

    @IsOptional()
    @IsString()
    modelId?: string;

    @IsOptional()
    @IsString()
    elementGuid?: string;

    @IsOptional()
    @IsEnum(AssetStatus)
    status?: AssetStatus;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    manufacturer?: string;

    @IsOptional()
    @IsString()
    modelNumber?: string;

    @IsOptional()
    @IsString()
    serialNumber?: string;

    @IsOptional()
    @IsDateString()
    purchaseDate?: string;

    @IsOptional()
    @IsDateString()
    warrantyExpiry?: string;

    @IsOptional()
    @IsJSON()
    metadata?: any;
}
