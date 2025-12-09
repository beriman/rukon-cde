import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ChecklistService } from './checklist.service';

@Controller('mobilization')
export class MobilizationController {
    constructor(private readonly checklistService: ChecklistService) { }

    @Post('checklists')
    create(@Body() data: any) {
        return this.checklistService.createChecklist(data);
    }

    @Get('checklists/:id')
    findAll(@Param('id') id: string) {
        return this.checklistService.getChecklist(id);
    }

    @Patch('checklists/:id/items/:itemId')
    updateItem(
        @Param('id') id: string,
        @Param('itemId') itemId: string,
        @Body('status') status: string
    ) {
        return this.checklistService.updateItem(id, itemId, status);
    }
}
