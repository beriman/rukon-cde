import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsUUID()
    @IsOptional()
    organizationId?: string;

    @IsString()
    @IsOptional()
    newOrganizationName?: string;
}
