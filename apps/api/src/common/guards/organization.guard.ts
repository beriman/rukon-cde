import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const orgId = request.headers['x-org-id'] || request.params.organizationId;

        if (!orgId) {
            // If no org context is required, allow access
            return true;
        }

        // Check if user belongs to the organization
        const membership = await this.prisma.organizationUser.findUnique({
            where: {
                userId_organizationId: {
                    userId: user.userId,
                    organizationId: orgId,
                },
            },
        });

        if (!membership) {
            throw new ForbiddenException('You do not have access to this organization');
        }

        // Attach membership info to request for downstream use
        request.organizationUser = membership;
        return true;
    }
}
