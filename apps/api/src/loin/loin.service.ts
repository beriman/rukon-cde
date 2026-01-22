import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IdsSpecification, IdsRule } from '@prisma/client';

export interface ValidationReport {
    timestamp: Date;
    totalElements: number;
    passed: number;
    failed: number;
    results: ElementValidationResult[];
}

export interface ElementValidationResult {
    elementId: string; // GUID
    elementName?: string;
    type: string;
    status: 'PASS' | 'FAIL';
    failedRules: string[]; // Descriptions of failed rules
}

export interface ElementData {
    guid: string;
    type: string; // IfcClass e.g. "IfcWall"
    name?: string;
    propertySets: {
        name: string;
        properties: { [key: string]: any };
    }[];
}

@Injectable()
export class LoinService {
    private readonly logger = new Logger(LoinService.name);

    constructor(private prisma: PrismaService) { }

    async createSpec(projectId: string, name: string, description?: string): Promise<IdsSpecification> {
        return this.prisma.idsSpecification.create({
            data: {
                projectId,
                name,
                description,
            },
        });
    }

    async getSpecs(projectId: string): Promise<IdsSpecification[]> {
        return this.prisma.idsSpecification.findMany({
            where: { projectId },
            include: { rules: true }
        });
    }

    async getSpec(id: string): Promise<IdsSpecification | null> {
        return this.prisma.idsSpecification.findUnique({
            where: { id },
            include: { rules: true }
        });
    }

    async createRule(specId: string, data: {
        ifcEntity: string;
        propertySet: string;
        property: string;
        requirement: string;
        value?: string;
    }): Promise<IdsRule> {
        return this.prisma.idsRule.create({
            data: {
                specId,
                ...data,
            },
        });
    }

    async deleteRule(ruleId: string): Promise<IdsRule> {
        return this.prisma.idsRule.delete({ where: { id: ruleId } });
    }

    async validateModel(projectId: string, elements: ElementData[]): Promise<ValidationReport> {
        // 1. Fetch active specs/rules for the project
        const specs = await this.prisma.idsSpecification.findMany({
            where: { projectId },
            include: { rules: true },
        });

        const activeRules = specs.flatMap(s => s.rules);

        // 2. Validate
        const results: ElementValidationResult[] = [];
        let passedCount = 0;
        let failedCount = 0;

        // Pre-group rules by entity for O(1) lookup
        const rulesByEntity = new Map<string, IdsRule[]>();
        const globalRules: IdsRule[] = [];

        for (const rule of activeRules) {
            if (rule.ifcEntity === 'IfcBuildingElement') {
                globalRules.push(rule);
            } else {
                if (!rulesByEntity.has(rule.ifcEntity)) {
                    rulesByEntity.set(rule.ifcEntity, []);
                }
                rulesByEntity.get(rule.ifcEntity)!.push(rule);
            }
        }

        // Optimization: Chunk processing to avoid blocking event loop
        const CHUNK_SIZE = 1000;

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];

            // Yield to event loop periodically
            if (i > 0 && i % CHUNK_SIZE === 0) {
                await new Promise(resolve => setImmediate(resolve));
            }

            const failedRulesForElement: string[] = [];

            // Find rules that apply to this element type
            const entityRules = rulesByEntity.get(el.type) || [];
            const applicableRules = [...entityRules, ...globalRules];

            for (const rule of applicableRules) {
                // Check Pset
                const pset = el.propertySets.find(ps => ps.name === rule.propertySet);

                if (!pset) {
                    failedRulesForElement.push(`Missing PropertySet: ${rule.propertySet}`);
                    continue;
                }

                // Check Property
                const propValue = pset.properties[rule.property];
                if (propValue === undefined || propValue === null) {
                    failedRulesForElement.push(`Missing Property: ${rule.property} in ${rule.propertySet}`);
                    continue;
                }

                // Check Requirement (MATCHES)
                if (rule.requirement === 'MATCHES' && rule.value) {
                    // Simple string comparison for now
                    if (String(propValue) !== rule.value) {
                        failedRulesForElement.push(`Value Mismatch: ${rule.property} = ${propValue}, expected ${rule.value}`);
                    }
                }
            }

            if (failedRulesForElement.length > 0) {
                results.push({
                    elementId: el.guid,
                    elementName: el.name,
                    type: el.type,
                    status: 'FAIL',
                    failedRules: failedRulesForElement,
                });
                failedCount++;
            } else {
                // Only push if we want to show passed elements, maybe opt-in?
                // For now, let's just count them, and maybe only push if they had applicable rules?
                if (applicableRules.length > 0) {
                    results.push({
                        elementId: el.guid,
                        elementName: el.name,
                        type: el.type,
                        status: 'PASS',
                        failedRules: [],
                    });
                    passedCount++;
                }
            }
        }

        return {
            timestamp: new Date(),
            totalElements: elements.length,
            passed: passedCount,
            failed: failedCount,
            results,
        };
    }
}
