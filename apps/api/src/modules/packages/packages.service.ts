import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.package.findMany({
      where: { isActive: true },
      include: {
        services: { include: { service: { select: { id: true, name: true, type: true } } } },
        _count: { select: { clientPackages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.package.findUnique({
      where: { id },
      include: { services: { include: { service: true } } },
    });
  }

  create(data: any) {
    const { services, ...pkg } = data;
    return this.prisma.package.create({
      data: {
        ...pkg,
        services: services?.length
          ? { create: services.map((s: any) => ({ serviceId: s.serviceId, quantity: s.quantity || 1 })) }
          : undefined,
      },
      include: { services: { include: { service: true } } },
    });
  }

  update(id: string, data: any) {
    return this.prisma.package.update({ where: { id }, data });
  }

  deactivate(id: string) {
    return this.prisma.package.update({ where: { id }, data: { isActive: false } });
  }

  async sell(data: any) {
    const pkg = await this.prisma.package.findUnique({ where: { id: data.packageId } });
    if (!pkg) throw new NotFoundException('Pacote não encontrado');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pkg.validityDays);
    const amountPaid = data.amountPaid !== undefined ? Number(data.amountPaid) : Number(pkg.totalPrice);

    return this.prisma.clientPackage.create({
      data: {
        clientId: data.clientId,
        packageId: data.packageId,
        soldById: data.soldById,
        expiresAt,
        sessionsTotal: pkg.totalSessions,
        sessionsUsed: 0,
        amountPaid,
        status: 'active',
        notes: data.notes,
      },
      include: {
        package: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
      },
    });
  }

  async markAsPaid(id: string, paymentMethod: string, registeredById: string) {
    const cp = await this.prisma.clientPackage.findUnique({
      where: { id },
      include: { package: { select: { name: true } }, client: { select: { name: true } } },
    });
    if (!cp) throw new NotFoundException('Pacote não encontrado');
    const [updated] = await this.prisma.$transaction([
      this.prisma.clientPackage.update({ where: { id }, data: { isPaid: true, paymentMethod: paymentMethod as any } }),
      this.prisma.cashEntry.create({
        data: {
          type: 'income',
          amount: cp.amountPaid,
          description: `Pacote: ${cp.package.name} — ${cp.client.name}`,
          category: 'Pacotes',
          paymentMethod: paymentMethod as any,
          registeredById,
          referenceDate: new Date(),
          isPaid: true,
        },
      }),
    ]);
    return updated;
  }

  getClientPackages(clientId: string) {
    return this.prisma.clientPackage.findMany({
      where: { clientId },
      include: {
        package: {
          include: {
            services: { include: { service: { select: { id: true, name: true, type: true } } } },
          },
        },
        soldBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAllClientPackages(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.prisma.clientPackage.findMany({
      where,
      include: {
        package: { select: { id: true, name: true, totalSessions: true, validityDays: true } },
        client: { select: { id: true, name: true, phone: true } },
        soldBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async useSession(clientPackageId: string, data: any) {
    const cp = await this.prisma.clientPackage.findUnique({ where: { id: clientPackageId } });
    if (!cp) throw new NotFoundException('Pacote do cliente não encontrado');
    if (cp.status !== 'active') throw new BadRequestException('Pacote não está ativo');
    if (cp.sessionsUsed >= cp.sessionsTotal) throw new BadRequestException('Pacote sem sessões restantes');
    if (new Date() > cp.expiresAt) {
      await this.prisma.clientPackage.update({ where: { id: clientPackageId }, data: { status: 'expired' } });
      throw new BadRequestException('Pacote expirado');
    }

    const newUsed = cp.sessionsUsed + 1;
    const newStatus = newUsed >= cp.sessionsTotal ? 'completed' : 'active';

    return this.prisma.clientPackage.update({
      where: { id: clientPackageId },
      data: { sessionsUsed: newUsed, status: newStatus },
      include: {
        package: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
      },
    });
  }
}
