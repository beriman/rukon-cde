import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinkElementDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    scheduleTaskId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    elementId: string; // IFC GUID

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    modelId: string; // File ID

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string;

    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    config?: any;
}
