import { PrismaClient, ProjectStatus, AuditAction, OrgRole, TemplateType, DocumentStatus, BcfTopicStatus, BcfTopicPriority, BcfTopicType, CaptureType, TransmittalStatus, RecipientStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting "MRT Jakarta Demo" Seeding...\n');

    // 1. Setup User & Organization
    const user = await prisma.user.upsert({
        where: { email: 'beriman.juliano@gmail.com' },
        update: {},
        create: {
            email: 'beriman.juliano@gmail.com',
            name: 'Beriman Juliano, S.Ds., M.M.',
            password: 'hashed_password_here', // In real life, use a real hash
        },
    });

    const org = await prisma.organization.upsert({
        where: { slug: 'jayakon-demo' },
        update: {},
        create: {
            name: 'PT Jaya Konstruksi Manggala Pratama Tbk (Demo)',
            slug: 'jayakon-demo',
        },
    });

    await prisma.organizationUser.upsert({
        where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
        update: { role: OrgRole.OWNER },
        create: { userId: user.id, organizationId: org.id, role: OrgRole.OWNER },
    });

    // 2. Create Project
    const project = await prisma.project.create({
        data: {
            name: 'MRT Jakarta Phase 3 - Southern Extension',
            code: 'MRT3-SE',
            organizationId: org.id,
            status: ProjectStatus.ACTIVE,
        },
    });

    console.log(`✅ Project Created: ${project.name} (${project.id})`);

    // 3. Create ISO 19650 Folders
    const rootFolders = [
        { name: '01-WIP', discipline: 'GENERAL', isSystem: true },
        { name: '02-SHARED', discipline: 'GENERAL', isSystem: true },
        { name: '03-PUBLISHED', discipline: 'GENERAL', isSystem: true },
        { name: '04-ARCHIVED', discipline: 'GENERAL', isSystem: true },
    ];

    for (const f of rootFolders) {
        const folder = await prisma.folder.create({
            data: {
                name: f.name,
                projectId: project.id,
                discipline: f.discipline,
                isSystem: f.isSystem,
            },
        });

        if (f.name === '01-WIP') {
            // Create subfolders for WIP
            const disciplines = ['ARCH', 'STRUCT', 'MEP'];
            for (const d of disciplines) {
                await prisma.folder.create({
                    data: {
                        name: d,
                        projectId: project.id,
                        parentId: folder.id,
                        discipline: d,
                    },
                });
            }
        }
    }

    // 4. Create Mock BIM File
    const wipArchFolder = await prisma.folder.findFirst({
        where: { projectId: project.id, name: 'ARCH' }
    });

    const bimFile = await prisma.file.create({
        data: {
            name: 'MRT3-JK-V1-ZZ-M3-A-0001.ifc',
            originalName: 'MRT3-JK-V1-ZZ-M3-A-0001.ifc',
            uniqueId: 'MRT3-JK-V1-ZZ-M3-A-0001',
            s3Key: `demo/mrt3-arch.ifc`,
            size: 15420000,
            mimeType: 'application/octet-stream',
            folderId: wipArchFolder!.id,
            uploadedBy: user.id,
            cdeState: 'WIP',
            versions: {
                create: {
                    version: 1,
                    s3Key: `demo/mrt3-arch.ifc`,
                    size: 15420000,
                    uploadedBy: user.id,
                    cdeState: 'WIP',
                }
            }
        }
    });

    // 5. Create Schedule (4D)
    const schedule = await prisma.schedule.create({
        data: {
            name: 'Master Construction Schedule Rev.01',
            type: 'CSV',
            projectId: project.id,
        }
    });

    const tasks = [
        { taskId: 'T01', name: 'Site Preparation', start: '2026-02-01', end: '2026-02-15' },
        { taskId: 'T02', name: 'Foundation - Zone A', start: '2026-02-16', end: '2026-03-15' },
        { taskId: 'T03', name: 'Columns - Level B1', start: '2026-03-16', end: '2026-04-10' },
        { taskId: 'T04', name: 'Slab - Level B1', start: '2026-04-11', end: '2026-04-30' },
    ];

    const taskRecords = [];
    for (const t of tasks) {
        const task = await prisma.scheduleTask.create({
            data: {
                scheduleId: schedule.id,
                taskId: t.taskId,
                name: t.name,
                startDate: new Date(t.start),
                endDate: new Date(t.end),
            }
        });
        taskRecords.push(task);
    }

    // 6. Create 4D Simulation Links
    // Linking mock GUIDs from a typical IFC file to tasks
    const mockGuids = [
        '3u$v9$z$fB$vB$vB$vB$vB', // Foundation 1
        '1a2b3c4d5e6f7g8h9i0j',  // Column 1
        '0j9i8h7g6f5e4d3c2b1a',  // Slab 1
    ];

    await prisma.simulationLink.create({
        data: {
            projectId: project.id,
            scheduleTaskId: taskRecords[1].id, // Foundation Task
            elementId: mockGuids[0],
            modelId: bimFile.id,
        }
    });

    await prisma.simulationLink.create({
        data: {
            projectId: project.id,
            scheduleTaskId: taskRecords[2].id, // Column Task
            elementId: mockGuids[1],
            modelId: bimFile.id,
        }
    });

    // 7. Create BoQ (5D)
    const boq = await prisma.billOfQuantities.create({
        data: {
            name: 'RAB Struktur Utama - MRT Phase 3',
            projectId: project.id,
            currency: 'IDR',
        }
    });

    const boqItems = [
        { description: 'Beton K-350 Ready Mix', unit: 'm3', qty: 450, rate: 1200000 },
        { description: 'Besi Tulangan Ulir D25', unit: 'kg', qty: 12500, rate: 15500 },
        { description: 'Bekisting Slab Basement', unit: 'm2', qty: 850, rate: 250000 },
    ];

    for (const item of boqItems) {
        const boqItem = await prisma.boQItem.create({
            data: {
                boqId: boq.id,
                description: item.description,
                unit: item.unit,
                quantity: item.qty,
                unitRate: item.rate,
                amount: item.qty * item.rate,
            }
        });

        // 8. Create 5D Cost Mappings
        // Link first BoQ Item (Concrete) to Foundation elements
        if (item.description.includes('Beton')) {
            await prisma.costMapping.create({
                data: {
                    boqItemId: boqItem.id,
                    elementGuid: mockGuids[0],
                    modelId: bimFile.id,
                }
            });
        }
    }

    console.log('\n🎉 MRT Jakarta Demo Seeding Completed!');
    console.log(`\n👉 Project ID for Demo: ${project.id}`);
    console.log(`👉 File ID for Demo: ${bimFile.id}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
