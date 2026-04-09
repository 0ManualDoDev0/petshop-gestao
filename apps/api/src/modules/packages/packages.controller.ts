import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PackagesService } from './packages.service';

@ApiTags('Pacotes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('packages')
export class PackagesController {
  constructor(private readonly service: PackagesService) {}

  // ── Templates ──────────────────────────────────────────────
  @Get()
  findAll() { return this.service.findAll(); }

  @Get('client-packages')
  findAllClientPackages(@Query('status') status?: string) {
    return this.service.findAllClientPackages(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() body: any) { return this.service.create(body); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(':id')
  deactivate(@Param('id') id: string) { return this.service.deactivate(id); }

  // ── Venda ───────────────────────────────────────────────────
  @Post('sell')
  sell(@Body() body: any, @Request() req: any) {
    return this.service.sell({ ...body, soldById: body.soldById || req.user?.id });
  }

  // ── Pacotes por cliente ─────────────────────────────────────
  @Get('client/:clientId')
  getClientPackages(@Param('clientId') clientId: string) {
    return this.service.getClientPackages(clientId);
  }

  // ── Marcar como pago ────────────────────────────────────────
  @Post('client-package/:id/mark-paid')
  markAsPaid(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.service.markAsPaid(id, body.paymentMethod || 'pix', body.registeredById || req.user?.id);
  }

  // ── Usar sessão ─────────────────────────────────────────────
  @Post('client-package/:id/use-session')
  useSession(@Param('id') id: string, @Body() body: any) {
    return this.service.useSession(id, body);
  }
}
