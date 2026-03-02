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
            include: { projectTeams: { include: { members: true } } }
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const isOwner = project.ownerId === userId;
        // User teams in this project
        const userTeams = project.projectTeams.filter(team =>
            team.members.some(member => member.id === userId)
        );
        const userWipFolderIds = userTeams.map(t => t.wipFolderId).filter(id => !!id);

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

        if (isOwner) return rootFolders;

        // Filter: If root is '01-WIP', only show folders assigned to user's teams
        return rootFolders.map(root => {
            if (root.name === '01-WIP') {
                return {
                    ...root,
                    children: root.children.filter(child => userWipFolderIds.includes(child.id))
                };
            }
            return root;
        });
    }
}
