import { PrismaClient, AuditAction } from '@prisma/client';
// Mock naming service since we can't easily import the NestJS one here without setup
// In a real environment, we'd use the service logic

const prisma = new PrismaClient();

async function healNamingConventions() {
    console.log('🛡️ Starting Rukon Self-Healing Operation: Naming Audit...');
    
    const files = await prisma.file.findMany();
    let issuesFound = 0;

    for (const file of files) {
        // Simple regex-based ISO 19650 validation
        // Format: PROJECT-ORIGINATOR-VOLUME-LEVEL-TYPE-ROLE-NUMBER
        const isoPattern = /^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[0-9]+(\.[A-Z0-9]+)?$/i;
        
        const filenameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        
        if (!isoPattern.test(filenameWithoutExt)) {
            console.log(`⚠️ Inconsistency Detected: File "${file.name}" (ID: ${file.id}) does not match ISO 19650.`);
            
            // Log as a "Smart Review" issue automatically
            await prisma.auditLog.create({
                data: {
                    userId: 'SYSTEM',
                    action: 'FILE_UPDATE' as any, // Assuming FILE_UPDATE for issues
                    resourceId: file.id,
                    resourceType: 'FILE',
                    details: {
                        issue: 'Naming Convention Violation',
                        currentName: file.name,
                        recommendedAction: 'Rename following ISO 19650 standards'
                    }
                }
            });
            issuesFound++;
        }
    }

    console.log(`\n✅ Self-Healing Complete. Found ${issuesFound} naming issues and logged them to Audit Trail.`);
}

healNamingConventions()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
