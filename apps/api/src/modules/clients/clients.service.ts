import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  findAll(q?: string) {
    return this.prisma.client.findMany({
      where: q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } }] } : {},
      include: { pets: true },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.client.findUnique({ where: { id }, include: { pets: true, packages: true } });
  }

  create(data: any, userId: string) {
    return this.prisma.client.create({ data: { ...data, createdById: userId } });
  }

  update(id: string, data: any) {
    return this.prisma.client.update({ where: { id }, data });
  }
}
