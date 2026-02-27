import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FilesService } from '../../files/files.service';
// import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ConversionService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async processFile(fileId: string, filePath: string) {
        // 1. Update Status to PROCESSING
        await this.prisma.file.update({
            where: { id: fileId },
            data: { cdeState: 'PROCESSING' }
        });

        console.log(`[CONVERSION] Starting conversion for ${fileId}...`);

        const odaPath = process.env.ODA_PATH || 'C:\\Program Files\\ODA\\ODAFileConverter 25.1.0\\ODAFileConverter.exe';
        const inputDir = path.dirname(filePath); // Local upload path

        // Checking if ODA exists
        if (fs.existsSync(odaPath)) {
            const outputDir = path.join(path.dirname(filePath), 'converted');
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            // ODA Usage: "ODAFileConverter.exe" "Input Folder" "Output Folder" "Version" "Type" "Recurse" "Audit"
            // It processes WHOLE FOLDER. So we must isolate the file or valid it.

            const { spawn } = require('child_process');
            const child = spawn(odaPath, [inputDir, outputDir, "IFC2x3", "IFC", "0", "0"]);

            child.on('close', async (code) => {
                if (code === 0) {
                    // Success. Find the generated .ifc
                    // ODA keeps same filename but changes extension: test.rvt -> test.ifc
                    const originalName = path.basename(filePath, path.extname(filePath));
                    const ifcFile = path.join(outputDir, `${originalName}.ifc`);

                    if (fs.existsSync(ifcFile)) {
                        // In real world: Upload `ifcFile` to S3 as a "derivative" or "viewable"
                        // For MVP: We just update the record to say "Hey, use this local file matches"
                        // Or better: We mark it as 'SHARED' which implies "Ready to View".

                        await this.prisma.file.update({
                            where: { id: fileId },
                            data: { cdeState: 'SHARED' }
                        });
                        console.log(`[CONVERSION] SUCCESS. IFC created at ${ifcFile}`);
                    }
                } else {
                    console.error(`[CONVERSION] ODA exited with code ${code}`);
                    await this.prisma.file.update({ where: { id: fileId }, data: { cdeState: 'ERROR' } });
                }
            });
        } else {
            // FALLBACK TO SIMULATION (If ODA not installed)
            console.log(`[CONVERSION] ODA not found at ${odaPath}. Using MOCK simulation.`);

            setTimeout(async () => {
                try {
                    // Mock: Just mark it ready
                    await this.prisma.file.update({
                        where: { id: fileId },
                        data: { cdeState: 'WIP' } // Ready
                    });
                    console.log(`[CONVERSION] Finished MOCK conversion for ${fileId}`);
                } catch (e) {
                    console.error(e);
                    await this.prisma.file.update({
                        where: { id: fileId },
                        data: { cdeState: 'ERROR' }
                    });
                }
            }, 5000); // 5 sec delay
        }
    }
}
