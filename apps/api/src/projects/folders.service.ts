import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService {
    constructor(private prisma: PrismaService) { }

    async create(createFolderDto: CreateFolderDto) {
        const { name, projectId, parentId } = createFolderDto;

        // Verify project exists
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // If parentId provided, verify parent folder exists and belongs to same project
        if (parentId) {
            const parentFolder = await this.prisma.folder.findUnique({
                where: { id: parentId },
            });

            if (!parentFolder) {
                throw new NotFoundException('Parent folder not found');
            }

            if (parentFolder.projectId !== projectId) {
                throw new BadRequestException('Parent folder must belong to the same project');
            }
        }

        return this.prisma.folder.create({
            data: {
                name,
                projectId,
                parentId,
            },
        });
    }

    async getFolderTree(projectId: string) {
        // Verify project exists
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Get root folders first
        const rootFolders = await this.prisma.folder.findMany({
            where: {
                projectId,
                parentId: null,
            },
            include: {
                children: {
                    include: {
                        children: {
                            include: {
                                children: true, // 3 levels deep
                            },
                        },
                    },
                },
            },
        });

        return rootFolders;
    }
}
