# Rodar o APK na faculdade (túnel HTTPS)

Objetivo: rodar o app no celular (APK) acessando a API no seu notebook.

Por que usar túnel: na rede da faculdade pode existir bloqueio entre dispositivos (o celular não enxerga o notebook no Wi‑Fi). Com túnel, o app acessa uma URL `https://...` pública que aponta para o seu `localhost`.

## Quick start (dia da apresentação)

1) Banco

- `docker compose up -d`

1) Prisma

- `npm run prisma:migrate`

1) API

- `npm run dev`

1) Túnel (Cloudflare)

- `cloudflared tunnel --url http://localhost:3000`

1) Front

- `API_BASE_URL = "https://xxxx.trycloudflare.com"`
- Teste no celular: `https://xxxx.trycloudflare.com/health` → `{ "ok": true }`

## Setup (uma vez no notebook)

Pré-requisitos:

- Node.js + npm
- Docker Desktop

Instalar o Cloudflare Tunnel:

- `winget install Cloudflare.cloudflared`

Observação (Windows): após instalar via `winget`, às vezes é necessário **abrir um novo terminal** para o comando `cloudflared` ser reconhecido.

Se ainda assim não reconhecer, você pode usar o executável pelo caminho do WinGet:

- `C:\Users\<seu-usuario>\AppData\Local\Microsoft\WinGet\Links\cloudflared.exe`

Exemplo:

- `C:\Users\<seu-usuario>\AppData\Local\Microsoft\WinGet\Links\cloudflared.exe tunnel --url http://localhost:3000`

## .env (importante)

Se ainda não tiver `.env`:

- `Copy-Item .env.example .env`

Confira:

- `DATABASE_URL=postgresql://...` (Postgres do Docker)
- `JWT_SECRET=...` (mín. 10 caracteres)
- `UPLOADS_DIR=uploads`

## Teste automatizado (recomendado)

Smoke local:

- `npm run smoke`

Smoke via túnel:

- `$env:BASE_URL="https://xxxx.trycloudflare.com"; npm run smoke`

Para limpar:

- `Remove-Item Env:BASE_URL`

## Troubleshooting rápido

### “Cannot GET /”

Use:

- `/health` para checar se a API está no ar
- `/docs` para ver o Swagger UI

### O túnel abre, mas o app não conecta

- Confirme que a API está rodando (`npm run dev`) e que `GET /health` funciona local.
- Confirme no celular: `https://xxxx.trycloudflare.com/health`.

### Plano B (se der ruim com a rede)

- Hotspot do celular: notebook e celular na mesma rede.

### Plano C (mais estável)

- Publicar backend e usar uma URL fixa `https://...` no app.
