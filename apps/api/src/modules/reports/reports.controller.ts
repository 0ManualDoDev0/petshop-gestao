import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@ApiTags('Relatórios')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('revenue')
  getRevenue(@Query('start') start: string, @Query('end') end: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.service.getRevenue(start || today, end || today);
  }

  @Get('employees')
  getEmployeeProduction(@Query('start') start: string, @Query('end') end: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.service.getEmployeeProduction(start || today, end || today);
  }

  @Get('packages')
  getPackagesReport(@Query('start') start: string, @Query('end') end: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.service.getPackagesReport(start || today, end || today);
  }
}
