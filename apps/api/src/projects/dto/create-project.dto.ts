import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsUUID()
    organizationId: string;
}
