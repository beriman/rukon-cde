import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Extract organizationId from JWT payload (already validated by JwtAuthGuard)
        const user = req['user'];

        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        // Attach organizationId to request for easy access in controllers/services
        if (user && (user as any).organizationId) {
            req['organizationId'] = (user as any).organizationId;
        }

        next();
    }
}
