import { IsString, IsDateString, IsArray, ValidateNested, IsEnum, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class AuditFindingDto {
    @IsString()
    @MinLength(3)
    clause: string;

    @IsEnum(['MAJOR', 'MINOR', 'OBSERVATION'])
    severity: 'MAJOR' | 'MINOR' | 'OBSERVATION';

    @IsString()
    @MinLength(10)
    description: string;

    @IsOptional()
    @IsString()
    evidence?: string;
}

export class CreateAuditDto {
    @IsDateString()
    auditDate: string;

    @IsString()
    @MinLength(3)
    auditor: string;

    @IsString()
    @MinLength(5)
    scope: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AuditFindingDto)
    findings: AuditFindingDto[];
}

export class UpdateFindingDto {
    @IsOptional()
    @IsEnum(['OPEN', 'RESPONDED', 'VERIFIED', 'CLOSED'])
    status?: 'OPEN' | 'RESPONDED' | 'VERIFIED' | 'CLOSED';

    @IsOptional()
    @IsDateString()
    responseDate?: string;

    @IsOptional()
    @IsString()
    closureEvidence?: string;
}

export class CreateEmergencyContactDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    role: string;

    @IsString()
    @MinLength(8)
    phone: string;

    @IsOptional()
    @IsBoolean()
    isPrimary?: boolean;
}
