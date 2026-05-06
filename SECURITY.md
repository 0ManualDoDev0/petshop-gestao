# Security Policy

## Versões Suportadas

| Versão | Suportada |
|--------|-----------|
| latest | ✅ |

## Reportando Vulnerabilidades

Se você encontrou uma vulnerabilidade de segurança, **não abra uma issue pública**.

Entre em contato diretamente por: pedro.rafael090301@gmail.com

Você receberá uma resposta em até 48 horas.

## Medidas de Segurança Implementadas

- **Helmet** — headers HTTP seguros (XSS, CSRF, clickjacking)
- **Rate Limiting** — 60 requisições/min por IP via ThrottlerGuard
- **JWT** — autenticação stateless com expiração de token
- **Bcrypt** — hash de senhas com salt rounds
- **ValidationPipe** — validação e sanitização de todos os inputs
- **CORS** — controle de origens permitidas
- **RBAC** — controle de acesso por perfil (dono/funcionário)
