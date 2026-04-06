import { Controller, Get, Post, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FinanceService } from './finance.service';

@ApiTags('Financeiro')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('finance')
export class FinanceController {
  constructor(private readonly service: FinanceService) {}
  @Get('summary') getSummary(@Query('start') start: string, @Query('end') end: string) { const today = new Date().toISOString().split('T')[0]; return this.service.getSummary(start || today, end || today); }
  @Get('daily-close') getDailyClose(@Query('date') date: string) { return this.service.getDailyClose(date); }
  @Get('cash-entries') getCashEntries(@Query() query: any) { return this.service.getCashEntries(query); }
  @Post('cash-entries') createEntry(@Body() body: any, @Request() req: any) { return this.service.createEntry({ ...body, registeredById: req.user?.id }); }
}
