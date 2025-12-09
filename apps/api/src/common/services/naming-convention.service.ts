import { Injectable } from '@nestjs/common';

interface ValidationResult {
    isValid: boolean;
    uniqueId?: string;
    error?: string;
    expected?: string;
    example?: string;
    components?: {
        project: string;
        originator: string;
        volume: string;
        level: string;
        type: string;
        role: string;
        number: string;
    };
}

@Injectable()
export class NamingConventionService {
    // ISO 19650 pattern: PROJECT-ORIGINATOR-VOLUME-LEVEL-TYPE-ROLE-NUMBER
    // Example: MRT3-ARC-A-01-DR-A-001
    private readonly pattern = /^([A-Z0-9]+)-([A-Z]+)-([A-Z0-9]+)-([A-Z0-9]+)-([A-Z]+)-([A-Z])-(\d+)$/;

    validate(fileName: string): ValidationResult {
        // Remove file extension
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');

        // Remove version suffix if present (e.g., _V2, _v3)
        const baseName = nameWithoutExt.replace(/_[Vv]\d+$/, '');

        const match = baseName.match(this.pattern);

        if (!match) {
            return {
                isValid: false,
                error: 'Invalid ISO 19650 naming format',
                expected: 'PROJECT-ORIGINATOR-VOLUME-LEVEL-TYPE-ROLE-NUMBER',
                example: 'MRT3-ARC-A-01-DR-A-001.pdf',
            };
        }

        const [, project, originator, volume, level, type, role, number] = match;

        return {
            isValid: true,
            uniqueId: baseName,
            components: {
                project,
                originator,
                volume,
                level,
                type,
                role,
                number,
            },
        };
    }

    extractUniqueId(fileName: string): string | null {
        const validation = this.validate(fileName);
        return validation.isValid ? validation.uniqueId : null;
    }
}
