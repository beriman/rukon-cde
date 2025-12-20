import { IsString, IsOptional } from 'class-validator';

export class LookupQrDto {
    @IsString()
    code: string;
}

export class GenerateQrDto {
    @IsString()
    type: 'asset' | 'room';

    @IsString()
    id: string;
}
