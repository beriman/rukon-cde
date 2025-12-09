import { IsEnum, IsDateString, IsString, MinLength, IsArray, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncidentDto {
    @IsEnum(['FIRST_AID', 'MTI', 'RWI', 'LTI', 'FATALITY', 'ILLNESS', 'VEHICLE_INCIDENT', 'SPILL', 'NEAR_MISS', 'UNSAFE_ACT'])
    type: 'FIRST_AID' | 'MTI' | 'RWI' | 'LTI' | 'FATALITY' | 'ILLNESS' | 'VEHICLE_INCIDENT' | 'SPILL' | 'NEAR_MISS' | 'UNSAFE_ACT';

    @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

    @IsDateString()
    date: string;

    @IsString()
    @MinLength(3)
    location: string;

    @IsString()
    @MinLength(10)
    description: string;

    @IsArray()
    @IsString({ each: true })
    witnesses: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[];
}

export class UpdateIncidentDto {
    @IsOptional()
    @IsString()
    @MinLength(10)
    rootCause?: string;

    @IsOptional()
    @IsEnum(['OPEN', 'INVESTIGATING', 'CLOSED'])
    status?: 'OPEN' | 'INVESTIGATING' | 'CLOSED';
}

export class CreateActionDto {
    @IsString()
    @MinLength(5)
    description: string;

    @IsOptional()
    @IsString()
    assigneeId?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;
}
