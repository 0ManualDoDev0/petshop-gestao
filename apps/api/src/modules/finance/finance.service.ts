import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getSummary(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const entries = await this.prisma.cashEntry.findMany({ where: { referenceDate: { gte: start, lte: end } } });
    const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0);
    const expense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0);
    return { period: { start: startDate, end: endDate }, income, expense, profit: income - expense, profitMargin: income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0 };
  }

  async getDailyClose(date?: string) {
    const day = date ? new Date(date) : new Date();
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
    const [entries, appointments] = await Promise.all([
      this.prisma.cashEntry.findMany({ where: { referenceDate: { gte: start, lte: end } }, include: { registeredBy: { select: { name: true } } } }),
      this.prisma.appointment.findMany({ where: { scheduledAt: { gte: start, lte: end } }, include: { client: { select: { name: true } }, pet: { select: { name: true } }, service: { select: { name: true } }, employee: { select: { name: true } } } }),
    ]);
    const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0);
    const expense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0);
    return { date: day.toISOString().split('T')[0], income, expense, balance: income - expense, entries, appointments };
  }

  getCashEntries(filters: any = {}) {
    const where: any = {};
    if (filters.startDate) where.referenceDate = { gte: new Date(filters.startDate) };
    if (filters.endDate) where.referenceDate = { ...where.referenceDate, lte: new Date(filters.endDate) };
    if (filters.type) where.type = filters.type;
    return this.prisma.cashEntry.findMany({ where, include: { registeredBy: { select: { name: true } } }, orderBy: { referenceDate: 'desc' } });
  }

  createEntry(data: any) {
    return this.prisma.cashEntry.create({ data: { type: data.type, amount: data.amount, description: data.description, category: data.category, paymentMethod: data.paymentMethod, referenceDate: new Date(data.referenceDate || Date.now()), notes: data.notes, registeredById: data.registeredById, isPaid: true } });
  }
}
