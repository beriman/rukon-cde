import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsOptional()
    @IsUUID()
    viewpointId?: string;
}
