import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HotelService } from './hotel.service';
@ApiTags('Hotel')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('hotel')
export class HotelController {
  constructor(private readonly service: HotelService) {}
  @Get('active') getActive() { return this.service.getActive(); }
  @Get('history') getHistory() { return this.service.getHistory(); }
  @Post('check-in') checkIn(@Body() body: any) { return this.service.checkIn(body); }
  @Patch(':id/check-out') checkOut(@Param('id') id: string) { return this.service.checkOut(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }
}
