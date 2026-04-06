"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🐾 Iniciando seed do banco de dados...');
        // ============================================================
        // USUÁRIOS
        // ============================================================
        const ownerHash = yield bcrypt.hash('senha123', 12);
        const empHash = yield bcrypt.hash('funcionario123', 12);
        const owner = yield prisma.user.upsert({
            where: { email: 'dono@petshop.com' },
            update: {},
            create: {
                name: 'Carlos Oliveira',
                email: 'dono@petshop.com',
                passwordHash: ownerHash,
                role: client_1.UserRole.owner,
                phone: '(34) 99999-0001',
            },
        });
        const manager = yield prisma.user.upsert({
            where: { email: 'gerente@petshop.com' },
            update: {},
            create: {
                name: 'Ana Paula Silva',
                email: 'gerente@petshop.com',
                passwordHash: empHash,
                role: client_1.UserRole.manager,
                phone: '(34) 99999-0002',
            },
        });
        const groomer1 = yield prisma.user.upsert({
            where: { email: 'lucia@petshop.com' },
            update: {},
            create: {
                name: 'Lúcia Fernandes',
                email: 'lucia@petshop.com',
                passwordHash: empHash,
                role: client_1.UserRole.employee,
                phone: '(34) 99999-0003',
            },
        });
        const groomer2 = yield prisma.user.upsert({
            where: { email: 'rafael@petshop.com' },
            update: {},
            create: {
                name: 'Rafael Costa',
                email: 'rafael@petshop.com',
                passwordHash: empHash,
                role: client_1.UserRole.employee,
                phone: '(34) 99999-0004',
            },
        });
        console.log('✅ Usuários criados');
        // ============================================================
        // SERVIÇOS
        // ============================================================
        const services = yield Promise.all([
            prisma.service.upsert({ where: { id: 'svc-banho-p' }, update: {}, create: { id: 'svc-banho-p', name: 'Banho — Pequeno', type: client_1.AppointmentType.banho, price: 45, cost: 8, durationMinutes: 60 } }),
            prisma.service.upsert({ where: { id: 'svc-banho-m' }, update: {}, create: { id: 'svc-banho-m', name: 'Banho — Médio', type: client_1.AppointmentType.banho, price: 65, cost: 12, durationMinutes: 75 } }),
            prisma.service.upsert({ where: { id: 'svc-banho-g' }, update: {}, create: { id: 'svc-banho-g', name: 'Banho — Grande', type: client_1.AppointmentType.banho, price: 90, cost: 18, durationMinutes: 90 } }),
            prisma.service.upsert({ where: { id: 'svc-tosa-p' }, update: {}, create: { id: 'svc-tosa-p', name: 'Tosa — Pequeno', type: client_1.AppointmentType.tosa, price: 55, cost: 8, durationMinutes: 60 } }),
            prisma.service.upsert({ where: { id: 'svc-tosa-m' }, update: {}, create: { id: 'svc-tosa-m', name: 'Tosa — Médio', type: client_1.AppointmentType.tosa, price: 80, cost: 12, durationMinutes: 75 } }),
            prisma.service.upsert({ where: { id: 'svc-bt-p' }, update: {}, create: { id: 'svc-bt-p', name: 'Banho + Tosa — Pequeno', type: client_1.AppointmentType.banho_e_tosa, price: 90, cost: 14, durationMinutes: 90 } }),
            prisma.service.upsert({ where: { id: 'svc-bt-m' }, update: {}, create: { id: 'svc-bt-m', name: 'Banho + Tosa — Médio', type: client_1.AppointmentType.banho_e_tosa, price: 130, cost: 20, durationMinutes: 120 } }),
            prisma.service.upsert({ where: { id: 'svc-hotel-d' }, update: {}, create: { id: 'svc-hotel-d', name: 'Hotel — Diária Pequeno/Médio', type: client_1.AppointmentType.hospedagem, price: 80, cost: 20, durationMinutes: 1440 } }),
            prisma.service.upsert({ where: { id: 'svc-taxi' }, update: {}, create: { id: 'svc-taxi', name: 'Táxi Dog', type: client_1.AppointmentType.taxi_dog, price: 30, cost: 10, durationMinutes: 30 } }),
        ]);
        console.log('✅ Serviços criados');
        // ============================================================
        // CLIENTES + PETS
        // ============================================================
        const client1 = yield prisma.client.upsert({
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
        const pet1 = yield prisma.pet.upsert({
            where: { id: 'pet-001' },
            update: {},
            create: { id: 'pet-001', clientId: client1.id, name: 'Bolinha', species: 'Cão', breed: 'Poodle', size: client_1.PetSize.pequeno, weight: 4.2 },
        });
        const client2 = yield prisma.client.upsert({
            where: { id: 'cli-002' },
            update: {},
            create: {
                id: 'cli-002',
                name: 'João Pereira',
                phone: '(34) 98765-1002',
                createdById: owner.id,
            },
        });
        const pet2 = yield prisma.pet.upsert({
            where: { id: 'pet-002' },
            update: {},
            create: { id: 'pet-002', clientId: client2.id, name: 'Thor', species: 'Cão', breed: 'Golden Retriever', size: client_1.PetSize.grande, weight: 28.5 },
        });
        const client3 = yield prisma.client.upsert({
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
        const pet3 = yield prisma.pet.upsert({
            where: { id: 'pet-003' },
            update: {},
            create: { id: 'pet-003', clientId: client3.id, name: 'Mel', species: 'Cão', breed: 'Shih Tzu', size: client_1.PetSize.pequeno, weight: 5.1 },
        });
        console.log('✅ Clientes e pets criados');
        // ============================================================
        // AGENDAMENTOS DE HOJE
        // ============================================================
        const today = new Date();
        const todayAt = (h, m = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
        const apt1 = yield prisma.appointment.upsert({
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
                status: client_1.AppointmentStatus.completed,
                type: client_1.AppointmentType.banho_e_tosa,
                priceCharged: 90,
                paymentMethod: client_1.PaymentMethod.pix,
                completedAt: todayAt(10, 30),
                startedAt: todayAt(9, 5),
            },
        });
        yield prisma.cashEntry.upsert({
            where: { id: 'ce-001' },
            update: {},
            create: {
                id: 'ce-001',
                type: client_1.CashEntryType.income,
                amount: 90,
                description: 'Banho + Tosa — Bolinha (Mariana Santos)',
                category: 'Serviços',
                paymentMethod: client_1.PaymentMethod.pix,
                appointmentId: apt1.id,
                registeredById: groomer1.id,
                referenceDate: today,
                isPaid: true,
            },
        });
        const apt2 = yield prisma.appointment.upsert({
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
                status: client_1.AppointmentStatus.in_progress,
                type: client_1.AppointmentType.banho,
                priceCharged: 90,
                startedAt: todayAt(10, 10),
            },
        });
        yield prisma.appointment.upsert({
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
                status: client_1.AppointmentStatus.scheduled,
                type: client_1.AppointmentType.tosa,
                priceCharged: 55,
            },
        });
        yield prisma.appointment.upsert({
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
                status: client_1.AppointmentStatus.scheduled,
                type: client_1.AppointmentType.banho,
                priceCharged: 45,
            },
        });
        // Despesas do mês
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        yield prisma.cashEntry.upsert({
            where: { id: 'ce-aluguel' },
            update: {},
            create: {
                id: 'ce-aluguel',
                type: client_1.CashEntryType.expense,
                amount: 2500,
                description: 'Aluguel do mês',
                category: 'Infraestrutura',
                paymentMethod: client_1.PaymentMethod.transfer,
                registeredById: owner.id,
                referenceDate: startOfMonth,
                isPaid: true,
            },
        });
        yield prisma.cashEntry.upsert({
            where: { id: 'ce-insumos' },
            update: {},
            create: {
                id: 'ce-insumos',
                type: client_1.CashEntryType.expense,
                amount: 650,
                description: 'Insumos — shampoo, condicionador, luvas',
                category: 'Insumos',
                paymentMethod: client_1.PaymentMethod.pix,
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
    });
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
