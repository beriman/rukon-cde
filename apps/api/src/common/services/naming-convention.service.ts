import { Injectable } from '@nestjs/common';

export interface ProjectNamingConfig {
    projectCode: string;
    allowedOriginators?: string[];
    allowedTypes?: string[];
}

interface ValidationResult {
    isValid: boolean;
    uniqueId?: string;
    error?: string;
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
    // Regex Standar ISO 19650
    private readonly defaultPattern = /^([A-Z0-9]+)-([A-Z0-9]+)-([A-Z0-9]+)-([A-Z0-9]+)-([A-Z0-9]+)-([A-Z0-9]+)-(\d{4,6})$/;

    validate(fileName: string, config?: ProjectNamingConfig): ValidationResult {
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
        // Hapus suffix revisi jika ada (misal _P01)
        const baseName = nameWithoutExt.replace(/_[A-Za-z0-9]+$/, '');

        const match = baseName.match(this.defaultPattern);

        if (!match) {
            return {
                isValid: false,
                error: 'Format nama tidak sesuai pola ISO 19650: PROJ-ORIG-VOL-LVL-TYPE-ROLE-NUM',
            };
        }

        const [, project, originator, volume, level, type, role, number] = match;

        // Validasi Kontekstual (Project Specific)
        if (config) {
            if (project !== config.projectCode) {
                return { isValid: false, error: `Kode proyek salah. Tertulis: ${project}, Seharusnya: ${config.projectCode}` };
            }
            if (config.allowedOriginators?.length && !config.allowedOriginators.includes(originator)) {
                return { isValid: false, error: `Originator '${originator}' tidak dikenal.` };
            }
        }

        return {
            isValid: true,
            uniqueId: baseName,
            components: { project, originator, volume, level, type, role, number },
        };
    }
}
