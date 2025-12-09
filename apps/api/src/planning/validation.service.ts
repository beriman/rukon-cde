import { Injectable } from '@nestjs/common';
import { PlanningDocument, TemplateType } from '@prisma/client';

@Injectable()
export class ValidationService {

    validateConsistency(pir: PlanningDocument, oir: PlanningDocument): { valid: boolean; issues: string[] } {
        const issues: string[] = [];

        if (pir.type !== TemplateType.PIR || oir.type !== TemplateType.OIR) {
            return { valid: false, issues: ['Invalid document types for comparison'] };
        }

        const pirContent = pir.content as any;
        const oirContent = oir.content as any;

        // Example Logic: Check if PIR goals align with OIR strategic objectives
        // This is a heuristic check for MVP
        if (oirContent.sections) {
            const strategicSection = oirContent.sections.find(s => s.id === 'strategic_objectives');
            if (strategicSection && pirContent.goals) {
                // Mock check: In reality, this would use NLP or keyword matching
                // For now, valid if goals exist
            }
        }

        // Mock Validation Rule: PIR must have at least one Milestone
        if (!pirContent.milestones || pirContent.milestones.length === 0) {
            issues.push('PIR is missing Milestones definition');
        }

        return {
            valid: issues.length === 0,
            issues
        };
    }

    validateNaming(name: string, type: TemplateType): boolean {
        // Simple regex check based on type
        // e.g., OIR-XXX
        if (type === TemplateType.OIR && !name.startsWith('ORG-')) return false;
        return true;
    }
}
