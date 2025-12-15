export class CreateTopicDto {
    title: string;
    description?: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
    type?: 'ERROR' | 'WARNING' | 'INFO' | 'REQUEST';
    assignedTo?: string;
    viewpoint?: CreateViewpointDto;
}

export class CreateViewpointDto {
    eyePosition: { x: number; y: number; z: number };
    direction: { x: number; y: number; z: number };
    upVector: { x: number; y: number; z: number };
    selection?: string[]; // Array of IfcGuids
    snapshot?: string; // base64 or S3 key
}
