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

    async getFolderTree(projectId: string, userId: string) {
        // Verify project exists
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Get user role and discipline in this organization
        const orgUser = await this.prisma.organizationUser.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: project.organizationId,
                },
            },
        });

        if (!orgUser) {
            throw new BadRequestException('User is not a member of this project organization');
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

        // If Admin or Owner, return all
        if (orgUser.role === 'OWNER' || orgUser.role === 'ADMIN') {
            return rootFolders;
        }

        // Filter based on discipline
        const userDiscipline = orgUser.discipline;

        const filterFolders = (folders: any[]) => {
            return folders.filter(folder => {
                // If folder has specific discipline
                if (folder.discipline) {
                    // Must match user discipline or be accessible
                    if (folder.discipline !== userDiscipline) {
                        return false;
                    }
                }

                // Recursively filter children
                if (folder.children && folder.children.length > 0) {
                    folder.children = filterFolders(folder.children);
                }

                return true;
            });
        };

        return filterFolders(rootFolders);
    }
    async update(id: string, name: string) {
        // Verify folder exists
        const folder = await this.prisma.folder.findUnique({ where: { id } });
        if (!folder) throw new NotFoundException('Folder not found');

        // Update name only (Path is dynamic based on hierarchy)
        return this.prisma.folder.update({
            where: { id },
            data: { name },
        });
    }

    async remove(id: string) {
        const folder = await this.prisma.folder.findUnique({
            where: { id },
            include: { children: true, files: true }
        });

        if (!folder) throw new NotFoundException('Folder not found');

        if (folder.children.length > 0 || folder.files.length > 0) {
            throw new BadRequestException('Cannot delete folder: It contains files or subfolders.');
        }

        return this.prisma.folder.delete({ where: { id } });
    }
}
