import { Controller, Get, Post, Put, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Usuários')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Roles('owner', 'manager')
  @ApiOperation({ summary: 'Listar funcionários' })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @Roles('owner', 'manager')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @Roles('owner')
  create(@Body() body: CreateUserDto) { return this.service.create(body); }

  @Put(':id')
  @Roles('owner')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) { return this.service.update(id, body); }

  @Patch(':id/toggle-active')
  @Roles('owner')
  toggleActive(@Param('id') id: string) { return this.service.toggleActive(id); }
}
