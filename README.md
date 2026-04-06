# 🐾 PetShop Gestão — Guia de Instalação e Uso

Sistema completo de gestão para petshop com banho, tosa, hotel e táxi dog.

## Estrutura do Projeto

```
petshop/
├── apps/
│   ├── api/                  ← Backend (NestJS + Prisma + PostgreSQL)
│   │   ├── prisma/
│   │   │   ├── schema.prisma ← Modelagem do banco de dados
│   │   │   └── seed.ts       ← Dados iniciais (usuários, serviços)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/         ← Login, JWT, Guards
│   │   │   │   ├── appointments/ ← Agendamentos (coração do sistema)
│   │   │   │   ├── finance/      ← Caixa, entradas, saídas
│   │   │   │   ├── dashboard/    ← KPIs em tempo real
│   │   │   │   ├── clients/      ← Clientes (tutores)
│   │   │   │   ├── pets/         ← Pets
│   │   │   │   ├── services/     ← Serviços e preços
│   │   │   │   ├── hotel/        ← Hospedagem
│   │   │   │   └── packages/     ← Pacotes de serviços
│   │   │   └── main.ts           ← Ponto de entrada
│   │   └── .env.example      ← Variáveis de ambiente
│   └── web/                  ← Frontend (Next.js + Tailwind)
│       ├── src/
│       │   ├── lib/
│       │   │   ├── api.ts    ← Cliente HTTP (axios)
│       │   │   └── store.ts  ← Estado global (Zustand)
│       │   └── app/          ← Páginas Next.js
│       └── public/
│           └── dashboard.html ← Protótipo visual completo
└── package.json              ← Monorepo raiz
```

---

## 🚀 Passo a Passo — Instalação Local

### Pré-requisitos
- **Node.js** 18+ → https://nodejs.org
- **PostgreSQL** 14+ → https://postgresql.org/download (ou use Docker abaixo)

---

### Opção A: PostgreSQL com Docker (mais fácil)

```bash
# Iniciar PostgreSQL via Docker
docker run --name petshop-db \
  -e POSTGRES_PASSWORD=suasenha \
  -e POSTGRES_DB=petshop_gestao \
  -p 5432:5432 \
  -d postgres:16
```

### Opção B: PostgreSQL instalado localmente

```bash
# Criar banco de dados
psql -U postgres -c "CREATE DATABASE petshop_gestao;"
```

---

### 1. Clonar e instalar dependências

```bash
# Entrar na pasta do projeto
cd petshop

# Instalar dependências de todos os apps
npm install
```

---

### 2. Configurar variáveis de ambiente (API)

```bash
# Copiar o arquivo de exemplo
cp apps/api/.env.example apps/api/.env

# Editar com suas configurações
nano apps/api/.env
```

Edite o arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/petshop_gestao"
JWT_SECRET="troque-por-uma-string-aleatoria-e-longa"
PORT=3001
```

---

### 3. Criar as tabelas no banco de dados

```bash
# Gerar o cliente Prisma e criar as tabelas
npm run db:migrate

# Quando perguntar pelo nome da migration, digite:
# init_petshop_schema
```

---

### 4. Popular com dados iniciais

```bash
npm run db:seed
```

Isso cria:
- **Usuários**: dono, gerente, 2 funcionários
- **Serviços**: banho, tosa, banho+tosa, hotel, táxi dog
- **Clientes e pets**: 3 clientes com pets
- **Agendamentos de hoje**: 4 agendamentos
- **Lançamentos de caixa**: despesas do mês

---

### 5. Iniciar o servidor

```bash
# Iniciar só a API
npm run dev:api

# Ou iniciar API + Web ao mesmo tempo
npm run dev
```

A API estará em: http://localhost:3001  
Documentação Swagger: http://localhost:3001/docs

---

## 🔑 Credenciais de Acesso

| Usuário | E-mail | Senha | Permissões |
|---------|--------|-------|------------|
| Carlos (Dono) | dono@petshop.com | senha123 | Tudo |
| Ana (Gerente) | gerente@petshop.com | funcionario123 | Operacional |
| Lúcia | lucia@petshop.com | funcionario123 | Agenda própria |
| Rafael | rafael@petshop.com | funcionario123 | Agenda própria |

---

## 📋 Principais Endpoints da API

### Autenticação
```
POST /api/v1/auth/login         → Login
POST /api/v1/auth/refresh       → Renovar token
```

### Agendamentos
```
GET  /api/v1/appointments/today          → Agenda do dia
POST /api/v1/appointments                → Criar agendamento
PATCH /api/v1/appointments/:id/start    → Iniciar atendimento
PATCH /api/v1/appointments/:id/complete → Concluir + lançar no caixa ⭐
PATCH /api/v1/appointments/:id/cancel   → Cancelar
```

### Dashboard
```
GET  /api/v1/dashboard/kpis    → KPIs em tempo real
```

### Financeiro
```
GET  /api/v1/finance/summary        → Resumo do período
GET  /api/v1/finance/daily-close    → Fechamento do dia
POST /api/v1/finance/cash-entries   → Lançamento manual
```

---

## 🌐 Exemplo de Uso da API

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dono@petshop.com","password":"senha123"}'
```

### Criar Agendamento
```bash
curl -X POST http://localhost:3001/api/v1/appointments \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "cli-001",
    "petId": "pet-001",
    "serviceId": "svc-bt-p",
    "employeeId": "ID_DA_LUCIA",
    "scheduledAt": "2026-03-30T09:00:00",
    "type": "banho_e_tosa",
    "priceCharged": 90
  }'
```

### Concluir Atendimento (registra no caixa automaticamente)
```bash
curl -X PATCH http://localhost:3001/api/v1/appointments/ID_DO_APT/complete \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod":"pix"}'
```

---

## 🚀 Deploy em Produção (Railway)

### 1. Criar conta no Railway
https://railway.app → Criar conta gratuita

### 2. Criar projeto
- New Project → Deploy from GitHub repo
- Selecionar a pasta `apps/api`

### 3. Adicionar PostgreSQL
- + New → Database → PostgreSQL
- Copiar a DATABASE_URL gerada

### 4. Configurar variáveis de ambiente no Railway
```
DATABASE_URL = (colada do PostgreSQL)
JWT_SECRET   = (string aleatória longa)
NODE_ENV     = production
PORT         = 3001
```

### 5. Deploy do frontend (Vercel)
https://vercel.com → Import Project → selecionar `apps/web`

Variável de ambiente no Vercel:
```
NEXT_PUBLIC_API_URL = https://sua-api.railway.app/api/v1
```

---

## 📱 App Mobile (React Native + Expo)

O app mobile usa a mesma API. Para iniciar o desenvolvimento:

```bash
# Instalar Expo CLI
npm install -g expo-cli

# Criar o app mobile
npx create-expo-app apps/mobile --template

# Iniciar
cd apps/mobile && expo start
```

O app mobile usa:
- **Expo Router** para navegação
- **Zustand** para estado (mesma lógica do web)
- **Expo Notifications** para alertas de agendamento
- **AsyncStorage** para cache offline

---

## 🗺️ Próximos Passos (Roadmap)

### Semana 1-2: MVP
- [ ] Configurar banco e rodar seed
- [ ] Testar endpoints no Swagger
- [ ] Conectar frontend ao backend

### Semana 3-4: Funcionalidades
- [ ] Completar módulo de clientes/pets
- [ ] Sistema de pacotes
- [ ] Relatórios financeiros

### Semana 5-6: Polish
- [ ] Notificações por WhatsApp (Evolution API)
- [ ] App mobile básico
- [ ] Deploy em produção

---

## 🆘 Suporte e Dúvidas

- **Documentação da API**: http://localhost:3001/docs
- **Prisma Studio** (ver banco visualmente): `npm run db:studio`
- **Resetar banco**: `npm run db:reset` (⚠️ apaga todos os dados)

---

*Desenvolvido para PetShop — Banho, Tosa, Hotel e Táxi Dog*
