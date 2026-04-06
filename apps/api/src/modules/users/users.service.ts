import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, lastLoginAt: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true },
    });
  }

  async create(data: any) {
    const hash = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash: hash, role: data.role, phone: data.phone },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async toggleActive(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return this.prisma.user.update({ where: { id }, data: { isActive: !user?.isActive } });
  }
}
