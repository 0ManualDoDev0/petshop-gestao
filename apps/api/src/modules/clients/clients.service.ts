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

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // Remove cash entries linked to appointments of this client
      await tx.cashEntry.deleteMany({
        where: { appointment: { clientId: id } },
      });
      // Remove appointments
      await tx.appointment.deleteMany({ where: { clientId: id } });
      // Remove client packages
      await tx.clientPackage.deleteMany({ where: { clientId: id } });
      // Remove pets
      await tx.pet.deleteMany({ where: { clientId: id } });
      // Remove client
      return tx.client.delete({ where: { id } });
    });
  }
}
