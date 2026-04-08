import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKPIs() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [todayApts, monthEntries, hotelStays, hotelToday, hotelMonth] = await Promise.all([
      this.prisma.appointment.findMany({ where: { scheduledAt: { gte: startOfDay, lte: endOfDay } }, include: { client: { select: { name: true } }, pet: { select: { name: true, breed: true } }, service: { select: { name: true, type: true } }, employee: { select: { name: true } } }, orderBy: { scheduledAt: 'asc' } }),
      this.prisma.cashEntry.findMany({ where: { referenceDate: { gte: startOfMonth } } }),
      this.prisma.hotelStay.findMany({ where: { OR: [{ status: 'active' }, { checkOut: { gt: today } }] }, include: { pet: { include: { client: { select: { name: true, phone: true } } } }, client: { select: { name: true, phone: true } } } }),
      this.prisma.hotelStay.findMany({ where: { checkOut: { gte: startOfDay, lte: endOfDay }, status: 'checked_out' } }),
      this.prisma.hotelStay.findMany({ where: { checkOut: { gte: startOfMonth }, status: 'checked_out' } }),
    ]);
    const todayIncome = monthEntries.filter(e => e.type === 'income' && new Date(e.referenceDate) >= startOfDay).reduce((s, e) => s + Number(e.amount), 0);
    const monthIncome = monthEntries.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0);
    const monthExpense = monthEntries.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0);
    const hotelTodayIncome = hotelToday.reduce((s, h) => s + Number(h.totalAmount || 0), 0);
    const hotelMonthIncome = hotelMonth.reduce((s, h) => s + Number(h.totalAmount || 0), 0);
    return { today: { date: today.toLocaleDateString('pt-BR'), income: todayIncome + hotelTodayIncome, totalAppointments: todayApts.length, completed: todayApts.filter(a => a.status === 'completed').length, scheduled: todayApts.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length, inProgress: todayApts.filter(a => a.status === 'in_progress').length, appointments: todayApts }, month: { income: monthIncome + hotelMonthIncome, expense: monthExpense, profit: monthIncome + hotelMonthIncome - monthExpense }, hotel: { petsCheckedIn: hotelStays.length, stays: hotelStays } };
  }
}
