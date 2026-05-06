# 🐾 PetShop Gestão

Sistema completo de gestão para petshop com banho, tosa, hotel e táxi dog.

---

## ✨ Funcionalidades

- ✅ Autenticação JWT com controle por perfil
- ✅ Agenda de serviços (banho, tosa, táxi dog)
- ✅ Hotel para pets com check-in e check-out
- ✅ Cadastro de clientes e pets
- ✅ Sistema de pacotes com controle de sessões
- ✅ Módulo financeiro com relatórios por período
- ✅ Dashboard em tempo real

---

## 🚀 Stack

| Camada   | Tecnologia          |
|----------|---------------------|
| Backend  | NestJS + TypeScript |
| ORM      | Prisma              |
| Banco    | PostgreSQL          |
| Auth     | JWT                 |
| Deploy   | Railway             |
| Frontend | HTML + CSS + JS     |

---

## ⚙️ Rodando localmente

```bash
git clone https://github.com/0ManualDoDev0/petshop-gestao.git
cd petshop-gestao/apps/api
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Acesse: `http://localhost:3000/dashboard.html`

---

## 🗂️ Estrutura

```
petshop-gestao/
├── apps/
│   └── api/
│       ├── src/
│       │   ├── auth/
│       │   ├── agenda/
│       │   ├── hotel/
│       │   ├── clientes/
│       │   ├── financeiro/
│       │   └── pacotes/
│       └── public/       # Dashboard
└── README.md
```

---

## 🔒 Segurança

| Medida | Implementação |
|---|---|
| Headers HTTP | Helmet |
| Rate Limiting | 60 req/min por IP (ThrottlerGuard) |
| Autenticação | JWT com expiração |
| Senhas | Bcrypt com salt |
| Validação | ValidationPipe global |
| Controle de acesso | RBAC (dono/funcionário) |

Encontrou uma vulnerabilidade? Veja [SECURITY.md](./SECURITY.md).
