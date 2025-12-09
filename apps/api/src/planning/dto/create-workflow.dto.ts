import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateWorkflowDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNotEmpty()
    stages: any[];
}
