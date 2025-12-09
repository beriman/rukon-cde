import { PrismaClient, TemplateType } from '@prisma/client';
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Planning Templates...');

    const templates = [
        {
            type: TemplateType.OIR,
            name: 'ISO 19650-2 OIR Template (Standard)',
            description: 'Organizational Information Requirements compliant with ISO 19650-1:2018',
            content: {
                sections: [
                    {
                        id: 'strategic_objectives',
                        title: 'Tujuan Strategis Organisasi',
                        helpText: 'Jelaskan tujuan bisnis jangka panjang yang ingin dicapai melalui manajemen informasi.',
                        defaultContent: 'Organisasi berkomitmen untuk menerapkan BIM Level 2...'
                    },
                    {
                        id: 'asset_management_policy',
                        title: 'Kebijakan Manajemen Aset',
                        helpText: 'Referensi ke standar manajemen aset (ISO 55000) yang digunakan.',
                        defaultContent: 'Mengikuti standar ISO 55001...'
                    }
                ]
            }
        },
        {
            type: TemplateType.PIR,
            name: 'Project Information Requirements (Template)',
            description: 'Key Decision Points and Questions for Project delivery',
            content: {
                milestones: [
                    { name: 'Concept Design', code: 'LOD 200' },
                    { name: 'Detailed Design', code: 'LOD 300' },
                    { name: 'Construction', code: 'LOD 400' }
                ],
                questions: [
                    { id: 'q1', text: 'Apakah desain memenuhi standar sustainability?' }
                ]
            }
        },
        {
            type: TemplateType.AIR,
            name: 'Asset Information Requirements (Facility Management)',
            description: 'Data requirements for FM handover (COBie)',
            content: {
                assets: [
                    { code: 'Pr_System', name: 'Mechanical System', attributes: ['Warranty', 'SerialNumber'] }
                ]
            }
        },
        {
            type: TemplateType.EIR,
            name: 'Exchange Information Requirements (Tender)',
            description: 'Requirements for the supply chain (Technical, Management, Commercial)',
            content: {
                sections: [
                    { id: 'tech_standard', title: 'Standards', content: 'ISO 19650, IFC4' },
                    { id: 'software', title: 'Software Platforms', content: 'Revit, Navisworks, Rukon CDE' }
                ]
            }
        },
        {
            type: TemplateType.BEP,
            name: 'BIM Execution Plan (Pre-Contract)',
            description: 'Response to EIR during tender phase',
            content: {
                sections: [
                    { id: 'proj_info', title: 'Project Information', content: '' },
                    { id: 'roles', title: 'Roles & Responsibilities', content: '' },
                    { id: 'collaboration', title: 'Collaboration Strategy', content: '' }
                ]
            }
        }
    ];

    for (const tmpl of templates) {
        // Upsert based on name + isSystem, or just create
        // Since we don't have a unique constraint on name+isSystem, we'll confirm logic. 
        // For simplicity in seed, we'll checking existing first.
        const existing = await prisma.documentTemplate.findFirst({
            where: { name: tmpl.name, isSystem: true }
        });

        if (!existing) {
            await prisma.documentTemplate.create({
                data: {
                    type: tmpl.type,
                    name: tmpl.name,
                    description: tmpl.description,
                    content: tmpl.content,
                    isSystem: true,
                    language: 'id' // Default to ID as per requirement 'System menyediakan template Bahasa Indonesia'
                }
            });
            console.log(`✅ Created ${tmpl.type}: ${tmpl.name}`);
        } else {
            console.log(`⏩ Skipped ${tmpl.type}: ${tmpl.name} (Already exists)`);
        }
    }

    console.log('✅ Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
