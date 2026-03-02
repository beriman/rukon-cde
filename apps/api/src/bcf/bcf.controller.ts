import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BcfService } from './bcf.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
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

    @Post(':id/comments')
    addComment(
        @Param('id') topicId: string,
        @Request() req,
        @Body() createCommentDto: CreateCommentDto
    ) {
        return this.bcfService.addComment(topicId, req.user.id, createCommentDto);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') topicId: string,
        @Body() body: { status: string }
    ) {
        return this.bcfService.updateTopicStatus(topicId, body.status);
    }
}
