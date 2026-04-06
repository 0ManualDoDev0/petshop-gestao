import { PrismaClient, UserRole, AppointmentType, AppointmentStatus, PaymentMethod, CashEntryType, PetSize } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🐾 Iniciando seed do banco de dados...');

  // ============================================================
  // USUÁRIOS
  // ============================================================
  const ownerHash = await bcrypt.hash('senha123', 12);
  const empHash = await bcrypt.hash('funcionario123', 12);

  const owner = await prisma.user.upsert({
    where: { email: 'dono@petshop.com' },
    update: {},
    create: {
      name: 'Carlos Oliveira',
      email: 'dono@petshop.com',
      passwordHash: ownerHash,
      role: UserRole.owner,
      phone: '(34) 99999-0001',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'gerente@petshop.com' },
    update: {},
    create: {
      name: 'Ana Paula Silva',
      email: 'gerente@petshop.com',
      passwordHash: empHash,
      role: UserRole.manager,
      phone: '(34) 99999-0002',
    },
  });

  const groomer1 = await prisma.user.upsert({
    where: { email: 'lucia@petshop.com' },
    update: {},
    create: {
      name: 'Lúcia Fernandes',
      email: 'lucia@petshop.com',
      passwordHash: empHash,
      role: UserRole.employee,
      phone: '(34) 99999-0003',
    },
  });

  const groomer2 = await prisma.user.upsert({
    where: { email: 'rafael@petshop.com' },
    update: {},
    create: {
      name: 'Rafael Costa',
      email: 'rafael@petshop.com',
      passwordHash: empHash,
      role: UserRole.employee,
      phone: '(34) 99999-0004',
    },
  });

  console.log('✅ Usuários criados');

  // ============================================================
  // SERVIÇOS
  // ============================================================
  const services = await Promise.all([
    prisma.service.upsert({ where: { id: 'svc-banho-p' }, update: {}, create: { id: 'svc-banho-p', name: 'Banho — Pequeno', type: AppointmentType.banho, price: 45, cost: 8, durationMinutes: 60 } }),
    prisma.service.upsert({ where: { id: 'svc-banho-m' }, update: {}, create: { id: 'svc-banho-m', name: 'Banho — Médio', type: AppointmentType.banho, price: 65, cost: 12, durationMinutes: 75 } }),
    prisma.service.upsert({ where: { id: 'svc-banho-g' }, update: {}, create: { id: 'svc-banho-g', name: 'Banho — Grande', type: AppointmentType.banho, price: 90, cost: 18, durationMinutes: 90 } }),
    prisma.service.upsert({ where: { id: 'svc-tosa-p' }, update: {}, create: { id: 'svc-tosa-p', name: 'Tosa — Pequeno', type: AppointmentType.tosa, price: 55, cost: 8, durationMinutes: 60 } }),
    prisma.service.upsert({ where: { id: 'svc-tosa-m' }, update: {}, create: { id: 'svc-tosa-m', name: 'Tosa — Médio', type: AppointmentType.tosa, price: 80, cost: 12, durationMinutes: 75 } }),
    prisma.service.upsert({ where: { id: 'svc-bt-p' }, update: {}, create: { id: 'svc-bt-p', name: 'Banho + Tosa — Pequeno', type: AppointmentType.banho_e_tosa, price: 90, cost: 14, durationMinutes: 90 } }),
    prisma.service.upsert({ where: { id: 'svc-bt-m' }, update: {}, create: { id: 'svc-bt-m', name: 'Banho + Tosa — Médio', type: AppointmentType.banho_e_tosa, price: 130, cost: 20, durationMinutes: 120 } }),
    prisma.service.upsert({ where: { id: 'svc-hotel-d' }, update: {}, create: { id: 'svc-hotel-d', name: 'Hotel — Diária Pequeno/Médio', type: AppointmentType.hospedagem, price: 80, cost: 20, durationMinutes: 1440 } }),
    prisma.service.upsert({ where: { id: 'svc-taxi' }, update: {}, create: { id: 'svc-taxi', name: 'Táxi Dog', type: AppointmentType.taxi_dog, price: 30, cost: 10, durationMinutes: 30 } }),
  ]);

  console.log('✅ Serviços criados');

  // ============================================================
  // CLIENTES + PETS
  // ============================================================
  const client1 = await prisma.client.upsert({
    where: { id: 'cli-001' },
    update: {},
    create: {
      id: 'cli-001',
      name: 'Mariana Santos',
      phone: '(34) 98765-1001',
      email: 'mariana@email.com',
      createdById: owner.id,
    },
  });

  const pet1 = await prisma.pet.upsert({
    where: { id: 'pet-001' },
    update: {},
    create: { id: 'pet-001', clientId: client1.id, name: 'Bolinha', species: 'Cão', breed: 'Poodle', size: PetSize.pequeno, weight: 4.2 },
  });

  const client2 = await prisma.client.upsert({
    where: { id: 'cli-002' },
    update: {},
    create: {
      id: 'cli-002',
      name: 'João Pereira',
      phone: '(34) 98765-1002',
      createdById: owner.id,
    },
  });

  const pet2 = await prisma.pet.upsert({
    where: { id: 'pet-002' },
    update: {},
    create: { id: 'pet-002', clientId: client2.id, name: 'Thor', species: 'Cão', breed: 'Golden Retriever', size: PetSize.grande, weight: 28.5 },
  });

  const client3 = await prisma.client.upsert({
    where: { id: 'cli-003' },
    update: {},
    create: {
      id: 'cli-003',
      name: 'Fernanda Lima',
      phone: '(34) 98765-1003',
      email: 'fernanda@email.com',
      createdById: manager.id,
    },
  });

  const pet3 = await prisma.pet.upsert({
    where: { id: 'pet-003' },
    update: {},
    create: { id: 'pet-003', clientId: client3.id, name: 'Mel', species: 'Cão', breed: 'Shih Tzu', size: PetSize.pequeno, weight: 5.1 },
  });

  console.log('✅ Clientes e pets criados');

  // ============================================================
  // AGENDAMENTOS DE HOJE
  // ============================================================
  const today = new Date();
  const todayAt = (h: number, m = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);

  const apt1 = await prisma.appointment.upsert({
    where: { id: 'apt-001' },
    update: {},
    create: {
      id: 'apt-001',
      clientId: client1.id,
      petId: pet1.id,
      serviceId: 'svc-bt-p',
      employeeId: groomer1.id,
      createdById: owner.id,
      scheduledAt: todayAt(9),
      status: AppointmentStatus.completed,
      type: AppointmentType.banho_e_tosa,
      priceCharged: 90,
      paymentMethod: PaymentMethod.pix,
      completedAt: todayAt(10, 30),
      startedAt: todayAt(9, 5),
    },
  });

  await prisma.cashEntry.upsert({
    where: { id: 'ce-001' },
    update: {},
    create: {
      id: 'ce-001',
      type: CashEntryType.income,
      amount: 90,
      description: 'Banho + Tosa — Bolinha (Mariana Santos)',
      category: 'Serviços',
      paymentMethod: PaymentMethod.pix,
      appointmentId: apt1.id,
      registeredById: groomer1.id,
      referenceDate: today,
      isPaid: true,
    },
  });

  const apt2 = await prisma.appointment.upsert({
    where: { id: 'apt-002' },
    update: {},
    create: {
      id: 'apt-002',
      clientId: client2.id,
      petId: pet2.id,
      serviceId: 'svc-banho-g',
      employeeId: groomer2.id,
      createdById: manager.id,
      scheduledAt: todayAt(10),
      status: AppointmentStatus.in_progress,
      type: AppointmentType.banho,
      priceCharged: 90,
      startedAt: todayAt(10, 10),
    },
  });

  await prisma.appointment.upsert({
    where: { id: 'apt-003' },
    update: {},
    create: {
      id: 'apt-003',
      clientId: client3.id,
      petId: pet3.id,
      serviceId: 'svc-tosa-p',
      employeeId: groomer1.id,
      createdById: owner.id,
      scheduledAt: todayAt(14),
      status: AppointmentStatus.scheduled,
      type: AppointmentType.tosa,
      priceCharged: 55,
    },
  });

  await prisma.appointment.upsert({
    where: { id: 'apt-004' },
    update: {},
    create: {
      id: 'apt-004',
      clientId: client1.id,
      petId: pet1.id,
      serviceId: 'svc-banho-p',
      employeeId: groomer2.id,
      createdById: manager.id,
      scheduledAt: todayAt(15, 30),
      status: AppointmentStatus.scheduled,
      type: AppointmentType.banho,
      priceCharged: 45,
    },
  });

  // Despesas do mês
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  await prisma.cashEntry.upsert({
    where: { id: 'ce-aluguel' },
    update: {},
    create: {
      id: 'ce-aluguel',
      type: CashEntryType.expense,
      amount: 2500,
      description: 'Aluguel do mês',
      category: 'Infraestrutura',
      paymentMethod: PaymentMethod.transfer,
      registeredById: owner.id,
      referenceDate: startOfMonth,
      isPaid: true,
    },
  });

  await prisma.cashEntry.upsert({
    where: { id: 'ce-insumos' },
    update: {},
    create: {
      id: 'ce-insumos',
      type: CashEntryType.expense,
      amount: 650,
      description: 'Insumos — shampoo, condicionador, luvas',
      category: 'Insumos',
      paymentMethod: PaymentMethod.pix,
      registeredById: manager.id,
      referenceDate: new Date(today.getFullYear(), today.getMonth(), 5),
      isPaid: true,
    },
  });

  console.log('✅ Agendamentos e lançamentos de caixa criados');
  console.log('\n🐾 Seed concluído com sucesso!');
  console.log('\n👤 Credenciais de acesso:');
  console.log('   Dono    → dono@petshop.com      / senha123');
  console.log('   Gerente → gerente@petshop.com   / funcionario123');
  console.log('   Lúcia   → lucia@petshop.com     / funcionario123');
  console.log('   Rafael  → rafael@petshop.com    / funcionario123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
