import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { BimService } from './bim.service';
// Assuming JwtAuthGuard exists in 'src/auth/jwt-auth.guard' or similar
// Inspecting directory previously showed 'auth' dir.
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects/:projectId/bim')
@UseGuards(JwtAuthGuard)
export class BimController {
    constructor(private readonly bimService: BimService) { }

    @Get('models/:fileId/access-token')
    async getModelToken(
        @Param('projectId') projectId: string,
        @Param('fileId') fileId: string,
        @Request() req,
    ) {
        return this.bimService.getAccessToken(projectId, fileId, req.user.id);
    }
}
