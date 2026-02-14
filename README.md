# Ach Pet API

Backend (API) do projeto **Ach Pet** (adoção responsável + acompanhamento pós-adoção).

## Stack (sugestão de entrega acadêmica)

- Node.js + TypeScript + Express
- PostgreSQL (Docker)
- Prisma ORM
- JWT (autenticação) + controle de perfil (ADOPTER / SHELTER)

## Arquitetura (Clean Architecture)

- `src/domain`: regras/erros do domínio (independente de frameworks)
- `src/application`: **use cases** + **ports** (interfaces) — não conhece Express/Prisma
- `src/infra`: implementações (Prisma, JWT, Bcrypt, env)
- `src/presentation`: camada HTTP/Express (routers, middlewares, error handler)
- `src/app.ts`: composition root do Express (faz o *wiring* das dependências)

Diagrama (para relatório/apresentação): [docs/arquitetura-clean.md](docs/arquitetura-clean.md)

Fluxo do negócio (para apresentação): [docs/fluxo-negocio.md](docs/fluxo-negocio.md)

## Como rodar (Windows / PowerShell)

1) Suba o banco:

```powershell
docker compose up -d
```

1) Configure variáveis:

```powershell
Copy-Item .env.example .env
```

Edite `.env` e defina um `JWT_SECRET` forte (mín. 10 caracteres).

1) Instale dependências:

```powershell
npm install
```

1) Gere client do Prisma e rode migração:

```powershell
npm run prisma:generate
npm run prisma:migrate
```

1) Rode a API:

```powershell
npm run dev
```

A API sobe em `http://localhost:3000`.

## Mobile (React Native + Expo) — para o Alex

Veja o guia de implementação do app em [docs/mobile-expo-handoff.md](docs/mobile-expo-handoff.md).

## Seed (dados de teste) — para o BD (Kayky)

Com o banco rodando e migrado, você pode popular dados básicos:

```powershell
npm run prisma:seed
```

O seed cria 1 abrigo e 1 adotante (senha `123456`) e uma solicitação pendente.

## Postman — para a Alice

Arquivos:

- `postman/ach-pet.postman_collection.json`
- `postman/ach-pet.postman_environment.json`

Importe ambos no Postman e selecione o environment **Ach Pet - Local**. A coleção já salva tokens e IDs (petId, requestId, adoptionId, threadId) automaticamente pelos testes.

## Endpoints (resumo)

### Saúde

- `GET /health`

### Auth

- `POST /auth/register` (ADOPTER ou SHELTER)
- `POST /auth/login`

### Pets

- `GET /pets` (público, com filtros: `status`, `species`, `q`)
- `GET /pets/:id` (público)
- `POST /pets` (SHELTER)
- `POST /pets/:id/photos` (SHELTER, `multipart/form-data` com campo `photo`)
- `POST /pets/:id/favorite` (ADOPTER)
- `DELETE /pets/:id/favorite` (ADOPTER)

### Adoções

- `POST /adoptions/requests` (ADOPTER)
- `GET /adoptions/requests/mine` (ADOPTER)
- `GET /adoptions/requests/inbox` (SHELTER)
- `POST /adoptions/requests/:id/approve` (SHELTER, opcional `followUpDays`)
- `POST /adoptions/requests/:id/reject` (SHELTER)

### Chat (após aprovação)

- `GET /chat/threads/:threadId/messages` (participantes)
- `POST /chat/threads/:threadId/messages` (participantes)

### Acompanhamento pós-adoção

- `GET /followup/adoptions/:adoptionId/updates` (participantes)
- `POST /followup/adoptions/:adoptionId/updates` (participantes)

## Fluxo mínimo (para o app mobile)

1) Abrigo faz `POST /auth/register` com `role=SHELTER`.
2) Abrigo cria pet em `POST /pets` e envia fotos em `POST /pets/:id/photos`.
3) Adotante faz `POST /auth/register` com `role=ADOPTER`.
4) Adotante lista pets em `GET /pets` e faz solicitação em `POST /adoptions/requests`.
5) Abrigo lista inbox em `GET /adoptions/requests/inbox` e aprova em `POST /adoptions/requests/:id/approve`.
6) Com a adoção aprovada, usar o `thread.id` para mensagens no `/chat/...`.
7) Durante o período, adotante envia atualizações no `/followup/...` (texto e/ou `photoUrl`).