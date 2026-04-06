import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.service.findMany({ where: { isActive: true } }); }
  create(data: any) { return this.prisma.service.create({ data }); }
}
