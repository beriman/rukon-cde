import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateFolderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsUUID()
    @IsOptional()
    parentId?: string;
}
