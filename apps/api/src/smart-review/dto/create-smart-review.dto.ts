export class CreateValidationRuleDto {
    name: string;
    description?: string;
    category: string;
    ruleType: 'REGEX' | 'EXISTS' | 'VALUE';
    config: Record<string, any>;
}

export class CreateValidationReportDto {
    projectId: string;
    modelId: string;
    result: any;
    score: number;
}
