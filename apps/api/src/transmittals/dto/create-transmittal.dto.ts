import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateTransmittalDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsUUID("4", { each: true })
  recipientIds: string[];

  @IsArray()
  @IsUUID("4", { each: true })
  fileIds: string[];
}
