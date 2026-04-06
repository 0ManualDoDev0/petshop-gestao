import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PetsService } from './pets.service';
@ApiTags('Pets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('pets')
export class PetsController {
  constructor(private readonly service: PetsService) {}
  @Get() findByClient(@Query('clientId') clientId: string) { return this.service.findByClient(clientId); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
}
