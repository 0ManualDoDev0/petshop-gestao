import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  findAll(filters: any = {}) {
    const where: any = {};
    if (filters.date) {
      const day = new Date(filters.date);
      where.scheduledAt = { gte: new Date(day.getFullYear(), day.getMonth(), day.getDate()), lt: new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1) };
    }
    if (filters.status) where.status = filters.status;
    if (filters.employeeId) where.employeeId = filters.employeeId;
    return this.prisma.appointment.findMany({ where, include: { client: { select: { id: true, name: true, phone: true } }, pet: { select: { id: true, name: true, breed: true, size: true } }, service: { select: { id: true, name: true, type: true, durationMinutes: true } }, employee: { select: { id: true, name: true } } }, orderBy: { scheduledAt: 'asc' } });
  }

  getToday() {
    const today = new Date();
    return this.findAll({ date: today.toISOString().split('T')[0] });
  }

  create(data: any) {
    return this.prisma.appointment.create({
      data: {
        clientId: data.clientId,
        petId: data.petId || null,
        serviceId: data.serviceId || null,
        employeeId: data.employeeId || null,
        clientPackageId: data.clientPackageId || null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : new Date(),
        type: data.type || 'banho',
        priceCharged: data.priceCharged || 0,
        discount: data.discount || 0,
        notes: data.notes,
        createdById: data.createdById || data.employeeId || data.clientId,
      },
      include: {
        client: { select: { name: true } },
        pet: { select: { name: true } },
        service: { select: { name: true } },
      },
    });
  }

  async start(id: string) {
    const apt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!apt) throw new NotFoundException('Agendamento não encontrado');
    return this.prisma.appointment.update({ where: { id }, data: { status: 'in_progress', startedAt: new Date() } });
  }

  async complete(id: string, data: any) {
    const apt = await this.prisma.appointment.findUnique({ where: { id }, include: { service: true, client: true, pet: true } });
    if (!apt) throw new NotFoundException('Agendamento não encontrado');
    const finalPrice = data.finalPrice ?? Number(apt.priceCharged);

    // If the appointment is linked to a package, use a session instead of creating a cash entry
    if (apt.clientPackageId) {
      const cp = await this.prisma.clientPackage.findUnique({ where: { id: apt.clientPackageId } });
      if (cp && cp.status === 'active') {
        const newUsed = cp.sessionsUsed + 1;
        const newStatus = newUsed >= cp.sessionsTotal ? 'completed' : 'active';
        const [updatedApt] = await this.prisma.$transaction([
          this.prisma.appointment.update({ where: { id }, data: { status: 'completed', completedAt: new Date(), priceCharged: finalPrice, paymentMethod: 'pix', notes: data.notes } }),
          this.prisma.clientPackage.update({ where: { id: apt.clientPackageId }, data: { sessionsUsed: newUsed, status: newStatus } }),
        ]);
        return { appointment: updatedApt, cashEntry: null, message: `Sessão do pacote utilizada! (${newUsed}/${cp.sessionsTotal})` };
      }
    }

    const [updatedApt, cashEntry] = await this.prisma.$transaction([
      this.prisma.appointment.update({ where: { id }, data: { status: 'completed', completedAt: new Date(), priceCharged: finalPrice, paymentMethod: data.paymentMethod, notes: data.notes } }),
      this.prisma.cashEntry.create({ data: { type: 'income', amount: finalPrice, description: `${apt.service.name} — ${apt.pet.name} (${apt.client.name})`, category: 'Serviços', paymentMethod: data.paymentMethod, appointmentId: id, registeredById: data.registeredById || apt.employeeId, referenceDate: new Date(), isPaid: true } }),
    ]);
    return { appointment: updatedApt, cashEntry, message: 'Atendimento concluído e registrado no caixa!' };
  }

  cancel(id: string, reason: string) {
    return this.prisma.appointment.update({ where: { id }, data: { status: 'cancelled', cancelledReason: reason } });
  }

  update(id: string, data: any) {
    const allowed: any = {};
    if (data.serviceId !== undefined) allowed.serviceId = data.serviceId || null;
    if (data.employeeId !== undefined) allowed.employeeId = data.employeeId || null;
    if (data.priceCharged !== undefined) allowed.priceCharged = data.priceCharged;
    if (data.scheduledAt !== undefined) allowed.scheduledAt = new Date(data.scheduledAt);
    if (data.notes !== undefined) allowed.notes = data.notes;
    return this.prisma.appointment.update({ where: { id }, data: allowed });
  }

  async remove(id: string) {
    const apt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!apt) throw new NotFoundException('Agendamento não encontrado');
    if (apt.status === 'completed') throw new ForbiddenException('Não é possível excluir um agendamento já concluído');
    return this.prisma.appointment.delete({ where: { id } });
  }
}
