import { Controller, Get, Post, Patch, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';

@ApiTags('Agendamentos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}
  @Get() findAll(@Query() query: any) { return this.service.findAll(query); }
  @Get('today') getToday() { return this.service.getToday(); }
  @Post() create(@Body() body: any, @Request() req: any) { return this.service.create({ ...body, createdById: req.user?.id }); }
  @Patch(':id/start') start(@Param('id') id: string) { return this.service.start(id); }
  @Patch(':id/complete') complete(@Param('id') id: string, @Body() body: any, @Request() req: any) { return this.service.complete(id, { ...body, registeredById: req.user?.id }); }
  @Patch(':id/cancel') cancel(@Param('id') id: string, @Body() body: { reason: string }) { return this.service.cancel(id, body.reason); }
}
