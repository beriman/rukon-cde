import { IsString, IsArray, ValidateNested, MinLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PersonnelDocumentDto {
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    number?: string;

    @IsOptional()
    @IsString()
    expiry?: string;
}

export class CreatePersonnelDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(2)
    company: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PersonnelDocumentDto)
    documents: PersonnelDocumentDto[];
}

export class UpdatePTWDto {
    @IsOptional()
    @IsString()
    status?: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'REJECTED';

    @IsOptional()
    approvals?: any;
}
