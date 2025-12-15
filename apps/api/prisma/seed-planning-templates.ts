import { PrismaClient, TemplateType } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
    // OIR Templates
    {
        type: TemplateType.OIR,
        language: 'id',
        name: 'Template OIR Standar ISO 19650',
        description: 'Template Organizational Information Requirements untuk mendefinisikan kebutuhan informasi level organisasi',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'strategic_objectives',
                    title: 'Tujuan Strategis Organisasi',
                    helpText: 'Jelaskan tujuan bisnis jangka panjang organisasi yang relevan dengan manajemen aset dan informasi',
                    defaultContent: 'Organisasi kami bertujuan untuk mencapai efisiensi operasional maksimal melalui digitalisasi dan manajemen informasi yang terstruktur.'
                },
                {
                    id: 'asset_management_policy',
                    title: 'Kebijakan Manajemen Aset',
                    helpText: 'Deskripsikan kebijakan organisasi terkait lifecycle management aset',
                    defaultContent: 'Sesuai dengan ISO 55000, organisasi berkomitmen untuk mengelola aset secara optimal dari tahap perencanaan hingga disposal.'
                },
                {
                    id: 'information_requirements',
                    title: 'Kebutuhan Informasi Organisasi',
                    helpText: 'Tentukan jenis informasi yang dibutuhkan untuk mendukung pengambilan keputusan strategis',
                    defaultContent: 'Organisasi memerlukan informasi akurat terkait: kondisi aset, biaya lifecycle, performa operasional, dan compliance terhadap regulasi.'
                },
                {
                    id: 'data_standards',
                    title: 'Standar Data dan Klasifikasi',
                    helpText: 'Sebutkan standar klasifikasi yang digunakan (Uniclass, OmniClass, dll)',
                    defaultContent: 'Organisasi mengadopsi Uniclass 2015 untuk klasifikasi aset dan mengikuti naming convention ISO 19650.'
                }
            ]
        }
    },
    {
        type: TemplateType.OIR,
        language: 'en',
        name: 'ISO 19650 Standard OIR Template',
        description: 'Organizational Information Requirements template for defining organization-level information needs',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'strategic_objectives',
                    title: 'Organizational Strategic Objectives',
                    helpText: 'Describe the organization\'s long-term business objectives related to asset and information management',
                    defaultContent: 'Our organization aims to achieve maximum operational efficiency through digitalization and structured information management.'
                },
                {
                    id: 'asset_management_policy',
                    title: 'Asset Management Policy',
                    helpText: 'Describe organizational policy related to asset lifecycle management',
                    defaultContent: 'In accordance with ISO 55000, the organization is committed to optimal asset management from planning to disposal.'
                },
                {
                    id: 'information_requirements',
                    title: 'Organizational Information Requirements',
                    helpText: 'Define the types of information needed to support strategic decision-making',
                    defaultContent: 'The organization requires accurate information regarding: asset condition, lifecycle costs, operational performance, and regulatory compliance.'
                },
                {
                    id: 'data_standards',
                    title: 'Data Standards and Classification',
                    helpText: 'Specify the classification standards used (Uniclass, OmniClass, etc.)',
                    defaultContent: 'The organization adopts Uniclass 2015 for asset classification and follows ISO 19650 naming conventions.'
                }
            ]
        }
    },

    // PIR Templates
    {
        type: TemplateType.PIR,
        language: 'id',
        name: 'Template PIR Standar ISO 19650',
        description: 'Template Project Information Requirements untuk project-specific information needs',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'project_overview',
                    title: 'Gambaran Umum Proyek',
                    helpText: 'Jelaskan scope, lokasi, dan tujuan utama proyek',
                    defaultContent: 'Proyek ini bertujuan untuk [tujuan proyek] dengan lokasi di [lokasi] dan target penyelesaian [tanggal].'
                },
                {
                    id: 'key_decision_points',
                    title: 'Key Decision Points',
                    helpText: 'Tentukan milestone dan decision gate utama proyek',
                    defaultContent: JSON.stringify([
                        { stage: 'Concept', question: 'Apakah konsep desain layak secara finansial dan fungsional?' },
                        { stage: 'Technical Design', question: 'Apakah desain teknis memenuhi compliance regulasi?' },
                        { stage: 'Construction', question: 'Apakah konstruksi sesuai dengan desain approved?' }
                    ])
                },
                {
                    id: 'deliverables',
                    title: 'Deliverable Requirements',
                    helpText: 'Tentukan deliverable yang dibutuhkan per milestone',
                    defaultContent: 'Pada setiap stage, deliverable minimum mencakup: drawings (LOD sesuai stage), specifications, cost estimates, dan schedule.'
                },
                {
                    id: 'loin',
                    title: 'Level of Information Need (LOIN)',
                    helpText: 'Definisikan level kedetailan informasi yang dibutuhkan per stage (sesuai EN 17412-1)',
                    defaultContent: 'Stage 2 (Concept): LOD 200, Stage 3 (Technical): LOD 300, Stage 4 (Construction): LOD 350, Stage 5 (As-Built): LOD 400.'
                }
            ]
        }
    },

    // AIR Templates
    {
        type: TemplateType.AIR,
        language: 'id',
        name: 'Template AIR Standar ISO 19650',
        description: 'Template Asset Information Requirements untuk O&M phase requirements',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'asset_register',
                    title: 'Asset Register Requirements',
                    helpText: 'Tentukan aset-aset yang akan didokumentasikan untuk handover',
                    defaultContent: JSON.stringify([
                        { assetType: 'HVAC System', uniclassCode: 'Pr_70_70_36', requiredAttributes: ['SerialNumber', 'Manufacturer', 'WarrantyDate', 'MaintenanceSchedule'] },
                        { assetType: 'Chiller', uniclassCode: 'Pr_70_60_36', requiredAttributes: ['Capacity', 'RefrigerantType', 'EnergyRating'] }
                    ])
                },
                {
                    id: 'cobie_requirements',
                    title: 'COBie Data Requirements',
                    helpText: 'Spesifikasi COBie spreadsheet yang harus diserahkan',
                    defaultContent: 'COBie UK 2012 format required dengan sheets: Facility, Floor, Space, Zone, Type, Component, System, Assembly, Connection, Spare, Resource, Job, Document.'
                },
                {
                    id: 'om_manuals',
                    title: 'O&M Manual Requirements',
                    helpText: 'Format dan konten O&M manuals yang diperlukan',
                    defaultContent: 'O&M manuals harus mencakup: operating procedures, maintenance schedules, troubleshooting guides, spare parts list, warranty information.'
                },
                {
                    id: 'handover_format',
                    title: 'Handover Format',
                    helpText: 'Format data yang diterima saat handover (IFC, Revit, Excel, PDF)',
                    defaultContent: 'Handover deliverables: Federated IFC4 model, native Revit files, COBie spreadsheet (Excel), as-built drawings (PDF), O&M manuals (PDF).'
                }
            ]
        }
    },

    // EIR Templates  
    {
        type: TemplateType.EIR,
        language: 'id',
        name: 'Template EIR Standar ISO 19650',
        description: 'Template Exchange Information Requirements untuk tender documentation',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'technical_standards',
                    title: 'Technical Information Standards',
                    helpText: 'Tentukan standards, protocols, dan file formats yang harus digunakan',
                    defaultContent: JSON.stringify({
                        modelingStandards: ['ISO 19650-2', 'BS 1192'],
                        fileFormats: ['IFC 4', 'RVT 2022+', 'DWG 2018+', 'PDF/A'],
                        classification: 'Uniclass 2015',
                        namingConvention: 'ISO 19650 (Project-Originator-Volume-Level-Type-Role-Number)'
                    })
                },
                {
                    id: 'production_methods',
                    title: 'Information Production Methods and Procedures',
                    helpText: 'Jelaskan metodologi dan tools yang harus digunakan',
                    defaultContent: 'BIM Authoring Tools: Revit 2022+, ArchiCAD 25+, Tekla 2022+. Collaboration Platform: BIM 360, Autodesk Construction Cloud, atau CDE compliant platform.'
                },
                {
                    id: 'loin_matrix',
                    title: 'Level of Information Need Matrix',
                    helpText: 'Matriks LOIN per discipline dan stage',
                    defaultContent: JSON.stringify({
                        Architecture: { Stage2: 'LOD 200', Stage3: 'LOD 300', Stage4: 'LOD 350', Stage5: 'LOD 400' },
                        Structure: { Stage2: 'LOD 200', Stage3: 'LOD 300', Stage4: 'LOD 350', Stage5: 'LOD 400' },
                        MEP: { Stage2: 'LOD 200', Stage3: 'LOD 300', Stage4: 'LOD 350', Stage5: 'LOD 500' }
                    })
                },
                {
                    id: 'submission_strategy',
                    title: 'Submission Strategy',
                    helpText: 'Frekuensi dan format submission deliverables',
                    defaultContent: 'Design stage submissions: Monthly (WIP state), Milestone submissions: At each key decision point (Shared/Published state). Final submission: As-Built documentation (Published/Archived state).'
                },
                {
                    id: 'cde_workflow',
                    title: 'Common Data Environment Workflow',
                    helpText: 'Workflow states dan approval process di CDE',
                    defaultContent: 'Workflow states: WIP (Work in Progress) → Shared (Review) → Published (Approved) → Archived. Review cycle: Max 10 working days per submission.'
                }
            ]
        }
    },

    // BEP Template
    {
        type: TemplateType.BEP,
        language: 'id',
        name: 'Template BEP (Pre-appointment) ISO 19650',
        description: 'Template BIM Execution Plan untuk tender response',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'project_info',
                    title: '1. Project Information',
                    helpText: 'Project overview dan team structure',
                    defaultContent: 'Pre-fill from project database: Project name, code, client, lead appointed party, task teams.'
                },
                {
                    id: 'roles_responsibilities',
                    title: '2. Roles and Responsibilities',
                    helpText: 'BIM roles: Information Manager, CDE Manager, Lead Designers per discipline',
                    defaultContent: 'Information Manager: [Name], CDE Manager: [Name], Architecture Lead: [Name], Structure Lead: [Name], MEP Lead: [Name].'
                },
                {
                    id: 'delivery_strategy',
                    title: '3. Information Delivery Strategy',
                    helpText: 'Bagaimana team akan deliver informasi sesuai EIR',
                    defaultContent: 'Team akan menggunakan federated model approach dengan coordination responsibilities clearly defined. Clash detection weekly, model quality checks before each submission.'
                },
                {
                    id: 'it_infrastructure',
                    title: '4. IT Infrastructure and Software',
                    helpText: 'Tools dan platform yang akan digunakan',
                    defaultContent: 'BIM Authoring: Revit 2023, Collaboration: BIM 360 Docs, Clash Detection: Navisworks Manage, COBie Export: Revit plugins + Excel validation.'
                }
            ]
        }
    },

    // TIDP Template
    {
        type: TemplateType.TIDP,
        language: 'id',
        name: 'Template TIDP (Task Information Delivery Plan)',
        description: 'Template untuk discipline-specific delivery planning',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'discipline_info',
                    title: 'Discipline Information',
                    helpText: 'Team name, discipline, responsible person',
                    defaultContent: 'Discipline: [Architecture/Structure/MEP], Task Team: [Company Name], Lead: [Name].'
                },
                {
                    id: 'deliverables_table',
                    title: 'Deliverables Table',
                    helpText: 'Grid with columns: ID, Title, Type, Planned Date, Responsible',
                    defaultContent: 'Use TIDP editor to fill deliverables with ISO 19650 naming: Project-Originator-Volume-Level-Type-Role-Number.'
                },
                {
                    id: 'dependencies',
                    title: 'Dependencies and Constraints',
                    helpText: 'Dependencies to other disciplines or external factors',
                    defaultContent: 'List dependencies: e.g., "Structural model needed before MEP coordination", "Site survey data required by [date]".'
                }
            ]
        }
    },

    // MIDP Template
    {
        type: TemplateType.MIDP,
        language: 'id',
        name: 'Template MIDP (Master Information Delivery Plan)',
        description: 'Agregasi semua TIDP menjadi master plan',
        isSystem: true,
        content: {
            sections: [
                {
                    id: 'aggregation_summary',
                    title: 'Aggregation Summary',
                    helpText: 'Summary stats dari semua TIDP',
                    defaultContent: 'Total deliverables: [auto-calculate], Disciplines: [list], Status overview: [Planned/In Progress/Delivered counts].'
                },
                {
                    id: 'master_schedule',
                    title: 'Master Delivery Schedule',
                    helpText: 'Gantt view or table of all deliverables across disciplines',
                    defaultContent: 'Use MIDP editor to view aggregated deliverables. Color-coded by discipline, sortable by date/status.'
                },
                {
                    id: 'conflicts',
                    title: 'Conflict Detection',
                    helpText: 'List of duplicate IDs or date conflicts between TIDPs',
                    defaultContent: 'System auto-detects conflicts: [list conflicts if any]. Require resolution before approval.'
                }
            ]
        }
    }
];

async function main() {
    console.log('🌱 Starting template seeding...\n');

    for (const template of templates) {
        try {
            const created = await prisma.documentTemplate.create({
                data: template
            });
            console.log(`✅ Created ${created.type} template (${created.language}): ${created.name}`);
        } catch (error) {
            console.error(`❌ Failed to create ${template.type} template (${template.language}):`, error.message);
        }
    }

    console.log('\n🎉 Template seeding completed!');

    // Verify
    const count = await prisma.documentTemplate.count();
    console.log(`\n📊 Total templates in database: ${count}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
