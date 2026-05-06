import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { PetsModule } from './modules/pets/pets.module';
import { ServicesModule } from './modules/services/services.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { FinanceModule } from './modules/finance/finance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { PackagesModule } from './modules/packages/packages.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting — proteção contra brute force
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),

    // Módulos do sistema
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    PetsModule,
    ServicesModule,
    AppointmentsModule,
    FinanceModule,
    DashboardModule,
    HotelModule,
    PackagesModule,
    ReportsModule,
    AiModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
