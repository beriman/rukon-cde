import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { TransmittalsService } from './transmittals.service';
import { CreateTransmittalDto } from './dto/create-transmittal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('transmittals')
@UseGuards(JwtAuthGuard)
export class TransmittalsController {
  constructor(private readonly transmittalsService: TransmittalsService) {}

  @Post()
  create(@Body() createTransmittalDto: CreateTransmittalDto, @CurrentUser() user: any) {
    return this.transmittalsService.create(createTransmittalDto, user.id);
  }

  @Get()
  findAll(@Query('projectId') projectId: string) {
    return this.transmittalsService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transmittalsService.findOne(id);
  }
}
