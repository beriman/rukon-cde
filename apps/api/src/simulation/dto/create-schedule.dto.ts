import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
    @ApiProperty({ example: 'Main Construction Schedule' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'CSV', enum: ['CSV', 'MS_PROJECT', 'P6'] })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: 'ec4556-...' })
    @IsString()
    @IsNotEmpty()
    projectId: string;
}
