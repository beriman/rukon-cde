import { IsEnum, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { TemplateType, DocumentStatus } from '@prisma/client';

export class CreateDocumentDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(TemplateType)
    type: TemplateType;

    @IsObject()
    content: any;

    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @IsString()
    @IsOptional()
    projectId?: string;
}

export class UpdateDocumentDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsObject()
    @IsOptional()
    content?: any;

    @IsEnum(DocumentStatus)
    @IsOptional()
    status?: DocumentStatus;
}
