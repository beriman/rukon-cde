import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
    @IsString()
    name: string;

    @IsEnum(['EQUIPMENT', 'SITE', 'TOOLBOX', 'SAFETY_WALK'])
    type: string;

    items: any; // JSON template

    @IsOptional()
    @IsString()
    projectId?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class CreateDrillDto {
    @IsString()
    type: string; // FIRE, EARTHQUAKE, EVACUATION, CHEMICAL_SPILL

    @IsString()
    date: string;

    @IsString()
    conductedBy: string;

    duration: number; // minutes

    participants: string[];

    @IsOptional()
    @IsString()
    findings?: string;

    @IsOptional()
    photos?: string[];
}
