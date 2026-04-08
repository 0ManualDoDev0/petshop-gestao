import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}
  getActive() { return this.prisma.hotelStay.findMany({ where: { status: 'active' }, include: { pet: { include: { client: true } } } }); }
  checkIn(data: any) { return this.prisma.hotelStay.create({ data }); }
  async checkOut(id: string) {
    const stay = await this.prisma.hotelStay.findUnique({ where: { id } });
    const days = Math.ceil((Date.now() - stay!.checkIn.getTime()) / 86400000);
    return this.prisma.hotelStay.update({ where: { id }, data: { status: 'checked_out', checkOut: new Date(), totalDays: days, totalAmount: days * Number(stay!.dailyRate) } });
  }
  update(id: string, data: any) {
    const allowed: any = {};
    if (data.checkIn !== undefined) allowed.checkIn = new Date(data.checkIn);
    if (data.checkOut !== undefined) allowed.checkOut = data.checkOut ? new Date(data.checkOut) : null;
    if (data.feedingNotes !== undefined) allowed.feedingNotes = data.feedingNotes;
    if (data.medications !== undefined) allowed.medications = data.medications;
    const petUpdate: any = {};
    if (data.petName !== undefined) petUpdate.name = data.petName;
    if (data.clientName !== undefined) petUpdate.client = { update: { name: data.clientName } };
    if (Object.keys(petUpdate).length > 0) allowed.pet = { update: petUpdate };
    return this.prisma.hotelStay.update({ where: { id }, data: allowed, include: { pet: { include: { client: true } } } });
  }
  async togglePaid(id: string) {
    const stay = await this.prisma.hotelStay.findUnique({ where: { id } });
    return this.prisma.hotelStay.update({ where: { id }, data: { isPaid: !stay!.isPaid } });
  }
  remove(id: string) { return this.prisma.hotelStay.delete({ where: { id } }); }
  getHistory() {
    return this.prisma.hotelStay.findMany({
      orderBy: { checkIn: 'desc' },
      take: 50,
      include: { pet: { include: { client: true } } },
    });
  }
}
