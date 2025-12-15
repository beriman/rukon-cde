export class CreateSimulationLinkDto {
    taskId: string;
    elementId: string;
    modelId: string;
    config?: Record<string, any>;
}
