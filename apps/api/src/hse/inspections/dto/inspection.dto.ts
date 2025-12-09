import { IsEnum, IsDateString, IsArray, ValidateNested, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

class InspectionItemDto {
    @IsString()
    @MinLength(5)
    question: string;

    @IsEnum(['PASS', 'FAIL', 'NA'])
    result: 'PASS' | 'FAIL' | 'NA';

    @IsString()
    photo?: string;

    @IsString()
    comment?: string;
}

export class CreateInspectionDto {
    @IsEnum(['EXCAVATOR', 'CRANE', 'SCAFFOLDING', 'FIRE_EXTINGUISHER', 'ELECTRICAL_TOOLS', 'GENERAL_SITE'])
    type: 'EXCAVATOR' | 'CRANE' | 'SCAFFOLDING' | 'FIRE_EXTINGUISHER' | 'ELECTRICAL_TOOLS' | 'GENERAL_SITE';

    @IsDateString()
    date: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InspectionItemDto)
    items: InspectionItemDto[];
}

export class CreateMeetingDto {
    @IsEnum(['TBM', 'INDUCTION', 'EMERGENCY_DRILL'])
    type: 'TBM' | 'INDUCTION' | 'EMERGENCY_DRILL';

    @IsString()
    @MinLength(5)
    topic: string;

    @IsDateString()
    date: string;

    @IsArray()
    @IsString({ each: true })
    attendees: string[];

    @IsString()
    photo?: string;

    @IsString()
    notes?: string;
}
