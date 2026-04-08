import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private rangeOf(startDate: string, endDate: string) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  async getRevenue(startDate: string, endDate: string) {
    const { start, end } = this.rangeOf(startDate, endDate);

    const [entries, hotelStays] = await Promise.all([
      this.prisma.cashEntry.findMany({ where: { referenceDate: { gte: start, lte: end } }, orderBy: { referenceDate: 'asc' } }),
      // Todas as estadias que fizeram check-in no período (independente de status ou pagamento)
      this.prisma.hotelStay.findMany({ where: { checkIn: { gte: start, lte: end } } }),
    ]);

    const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0);
    const expense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0);
    // Para estadias com totalAmount calculado; para ativas sem checkout usa dailyRate * totalDays estimado
    const hotelIncome = hotelStays.reduce((s, h) => {
      if (h.totalAmount) return s + Number(h.totalAmount);
      const days = h.totalDays || Math.max(1, Math.ceil((Date.now() - new Date(h.checkIn).getTime()) / 86400000));
      return s + Number(h.dailyRate) * days;
    }, 0);
    const totalIncome = income + hotelIncome;

    // Group by day (cash + hotel)
    const byDayMap: Record<string, { income: number; expense: number }> = {};
    for (const e of entries) {
      const day = new Date(e.referenceDate).toISOString().split('T')[0];
      if (!byDayMap[day]) byDayMap[day] = { income: 0, expense: 0 };
      byDayMap[day][e.type as 'income' | 'expense'] += Number(e.amount);
    }
    for (const h of hotelStays) {
      const day = new Date(h.checkIn).toISOString().split('T')[0];
      if (!byDayMap[day]) byDayMap[day] = { income: 0, expense: 0 };
      byDayMap[day].income += Number(h.totalAmount || 0);
    }
    const byDay = Object.entries(byDayMap)
      .map(([date, v]) => ({ date, ...v, profit: v.income - v.expense }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group by category (cash + hotel)
    const byCatMap: Record<string, { income: number; expense: number }> = {};
    for (const e of entries) {
      if (!byCatMap[e.category]) byCatMap[e.category] = { income: 0, expense: 0 };
      byCatMap[e.category][e.type as 'income' | 'expense'] += Number(e.amount);
    }
    if (hotelIncome > 0) {
      if (!byCatMap['Hotel']) byCatMap['Hotel'] = { income: 0, expense: 0 };
      byCatMap['Hotel'].income += hotelIncome;
    }
    const byCategory = Object.entries(byCatMap)
      .map(([category, v]) => ({ category, ...v }))
      .sort((a, b) => b.income - a.income);

    // Group by payment method (income only; hotel shown separately)
    const byPayMap: Record<string, number> = {};
    for (const e of entries.filter(e => e.type === 'income')) {
      byPayMap[e.paymentMethod] = (byPayMap[e.paymentMethod] || 0) + Number(e.amount);
    }
    if (hotelIncome > 0) byPayMap['hotel'] = (byPayMap['hotel'] || 0) + hotelIncome;
    const byPaymentMethod = Object.entries(byPayMap)
      .map(([method, amount]) => ({ method, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      period: { start: startDate, end: endDate },
      totals: {
        income: totalIncome,
        expense,
        profit: totalIncome - expense,
        profitMargin: totalIncome > 0 ? +((totalIncome - expense) / totalIncome * 100).toFixed(1) : 0,
        transactions: entries.length + hotelStays.length,
      },
      byDay,
      byCategory,
      byPaymentMethod,
    };
  }

  async getEmployeeProduction(startDate: string, endDate: string) {
    const { start, end } = this.rangeOf(startDate, endDate);

    const appointments = await this.prisma.appointment.findMany({
      where: { scheduledAt: { gte: start, lte: end } },
      include: { employee: { select: { id: true, name: true } } },
    });

    const map: Record<string, {
      employee: { id: string; name: string };
      total: number; completed: number; cancelled: number; inProgress: number;
      revenue: number;
    }> = {};

    for (const apt of appointments) {
      if (!apt.employee) continue;
      const { id, name } = apt.employee;
      if (!map[id]) map[id] = { employee: { id, name }, total: 0, completed: 0, cancelled: 0, inProgress: 0, revenue: 0 };
      map[id].total++;
      if (apt.status === 'completed') { map[id].completed++; map[id].revenue += Number(apt.priceCharged); }
      if (apt.status === 'cancelled') map[id].cancelled++;
      if (apt.status === 'in_progress') map[id].inProgress++;
    }

    return Object.values(map)
      .map(r => ({
        ...r,
        completionRate: r.total > 0 ? +((r.completed / r.total) * 100).toFixed(1) : 0,
        avgTicket: r.completed > 0 ? +(r.revenue / r.completed).toFixed(2) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getPackagesReport(startDate: string, endDate: string) {
    const { start, end } = this.rangeOf(startDate, endDate);

    const clientPackages = await this.prisma.clientPackage.findMany({
      where: { purchasedAt: { gte: start, lte: end } },
      include: {
        package: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, phone: true } },
        soldBy: { select: { id: true, name: true } },
      },
      orderBy: { purchasedAt: 'desc' },
    });

    const totalRevenue = clientPackages.reduce((s, cp) => s + Number(cp.amountPaid), 0);
    const sessionsTotal = clientPackages.reduce((s, cp) => s + cp.sessionsTotal, 0);
    const sessionsUsed = clientPackages.reduce((s, cp) => s + cp.sessionsUsed, 0);

    // Group by package template
    const byPkgMap: Record<string, { name: string; sold: number; revenue: number; sessionsTotal: number; sessionsUsed: number }> = {};
    for (const cp of clientPackages) {
      const pkgId = cp.package.id;
      if (!byPkgMap[pkgId]) byPkgMap[pkgId] = { name: cp.package.name, sold: 0, revenue: 0, sessionsTotal: 0, sessionsUsed: 0 };
      byPkgMap[pkgId].sold++;
      byPkgMap[pkgId].revenue += Number(cp.amountPaid);
      byPkgMap[pkgId].sessionsTotal += cp.sessionsTotal;
      byPkgMap[pkgId].sessionsUsed += cp.sessionsUsed;
    }

    // Status breakdown
    const byStatus = clientPackages.reduce((acc: Record<string, number>, cp) => {
      acc[cp.status] = (acc[cp.status] || 0) + 1;
      return acc;
    }, {});

    return {
      period: { start: startDate, end: endDate },
      totals: {
        sold: clientPackages.length,
        revenue: totalRevenue,
        sessionsTotal,
        sessionsUsed,
        sessionsRemaining: sessionsTotal - sessionsUsed,
        sessionUsageRate: sessionsTotal > 0 ? +((sessionsUsed / sessionsTotal) * 100).toFixed(1) : 0,
      },
      byStatus,
      byPackage: Object.values(byPkgMap).sort((a, b) => b.revenue - a.revenue),
      recentSales: clientPackages.slice(0, 20),
    };
  }
}
