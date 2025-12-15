import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BcfService } from './bcf.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects/:projectId/bcf/topics')
@UseGuards(JwtAuthGuard)
export class BcfController {
    constructor(private readonly bcfService: BcfService) { }

    @Post()
    create(
        @Param('projectId') projectId: string,
        @Request() req,
        @Body() createTopicDto: CreateTopicDto
    ) {
        return this.bcfService.createTopic(projectId, req.user.id, createTopicDto);
    }

    @Get()
    findAll(@Param('projectId') projectId: string) {
        return this.bcfService.getTopics(projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bcfService.getTopic(id);
    }
}
