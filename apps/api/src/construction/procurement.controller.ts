import { Body, Controller, Get, Param, Patch, Post, Query , UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProcurementService } from './procurement.service';
import { ProcurementStatus } from '@prisma/client';

export class CreateProcurementItemDto {
    projectId: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    supplier?: string;
    orderDate?: string;
    deliveryDate?: string;
}

export class ImportCSVDto {
    projectId: string;
    items: Array<{
        name: string;
        category: string;
        quantity: number;
        unit: string;
        supplier?: string;
        orderDate?: string;
        deliveryDate?: string;
    }>;
}

export class CreateBQItemDto {
    projectId: string;
    itemCode: string;
    description: string;
    unit: string;
    plannedQty: number;
    unitPrice: number;
    workPackageId?: string;
}

@Controller('construction/procurement')
@UseGuards(JwtAuthGuard)
export class ProcurementController {
    constructor(private readonly procurementService: ProcurementService) { }

    @Post('items')
    async createItem(@Body() dto: CreateProcurementItemDto) {
        return this.procurementService.createItem({
            ...dto,
            orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
            deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : undefined,
        });
    }

    @Post('import')
    async importCSV(@Body() dto: ImportCSVDto) {
        return this.procurementService.importFromCSV(dto.projectId, dto.items);
    }

    @Patch('items/:id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: ProcurementStatus) {
        return this.procurementService.updateStatus(id, status);
    }

    @Get('items/:projectId')
    async getItems(
        @Param('projectId') projectId: string,
        @Query('status') status?: ProcurementStatus,
    ) {
        return this.procurementService.getItems(projectId, status);
    }

    @Post('bq')
    async createBQItem(@Body() dto: CreateBQItemDto) {
        return this.procurementService.createBQItem(dto);
    }

    @Patch('bq/:id/actual')
    async updateActualQty(@Param('id') id: string, @Body('actualQty') actualQty: number) {
        return this.procurementService.updateActualQty(id, actualQty);
    }

    @Get('bq/:projectId')
    async getBQItems(@Param('projectId') projectId: string) {
        return this.procurementService.getBQItems(projectId);
    }

    @Get('bq/:projectId/summary')
    async getBQSummary(@Param('projectId') projectId: string) {
        return this.procurementService.getBQSummary(projectId);
    }
}
