# Ach Pet API

## Fallback seguro para uploads locais

Se as variáveis do Cloudinary não estiverem configuradas, o projeto utiliza o LocalStorageProvider, salvando arquivos na pasta `/uploads`. Isso garante que o sistema continue funcionando mesmo sem integração cloud.

<!--
	Badges de status automáticos e informativos:
	- Build: status da última build (CI)
	- Coverage: cobertura de testes automatizados
	- License: tipo de licença do projeto
	- Node: versão mínima recomendada
	- Docker: pronto para containerização
	- PRs Welcome: incentivo à contribuição
-->

![Build Status](https://img.shields.io/github/actions/workflow/status/LenilsonSoares/ach-pet-api/ci.yml?branch=master&label=build)
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
![License](https://img.shields.io/github/license/LenilsonSoares/ach-pet-api)
![Node](https://img.shields.io/badge/node-%3E=18.0.0-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

<!--
	Descrição profissional:
	- Projeto acadêmico e open source
	- Clean Architecture, testes, CI/CD, observabilidade
	- Pronto para produção e extensível
-->

Backend (API) do projeto **Ach Pet** — plataforma para adoção responsável e acompanhamento pós-adoção.

## Stack

- Node.js + TypeScript + Express
- PostgreSQL (Docker)
- Prisma ORM
- JWT (autenticação) + controle de perfil (ADOPTER / SHELTER)
- Cloudinary (uploads)
- Observabilidade: Pino, Prometheus, OpenTelemetry

## Arquitetura

Clean Architecture:

- `src/domain`: entidades, value objects, regras e erros do domínio (independente de frameworks)
- `src/application`: use cases, ports/interfaces, boundaries, presenters (não conhece Express/Prisma)
- `src/infra`: implementações (Prisma, JWT, Bcrypt, env, uploads, observabilidade)
- `src/presentation`: camada HTTP/Express (routers, middlewares, handlers, error handler)
- `src/app.ts`: composition root do Express (faz o *wiring* das dependências)

Diagrama: [docs/arquitetura-clean.md](docs/arquitetura-clean.md)
Fluxo do negócio: [docs/fluxo-negocio.md](docs/fluxo-negocio.md)

## Como rodar localmente

1. Suba o banco de dados (PostgreSQL via Docker Compose):

 ```powershell
 docker compose up -d
 ```

1. Copie e configure as variáveis de ambiente:

 ```powershell
 Copy-Item .env.example .env
 # Edite .env e defina um JWT_SECRET forte (mín. 10 caracteres)
 ```

1. Instale as dependências:

 ```powershell
 npm install
 ```

1. Gere o client do Prisma e rode as migrações:

 ```powershell
 npm run prisma:generate
 npm run prisma:migrate
 ```

1. Rode a API em modo desenvolvimento:

 ```powershell
 npm run dev
 ```

1. Acesse: [http://localhost:3000](http://localhost:3000)

### Scripts úteis

- `npm run build` — build de produção
- `npm run start` — inicia API em produção
- `npm run lint` — lint com ESLint
- `npm run test` — testes unitários/integrados (Vitest)
- `npm run smoke` — smoke test
- `npm run prisma:studio` — abre Prisma Studio

Veja todos scripts no [package.json](package.json).

## Documentação da API

- OpenAPI: [docs/openapi-example.yaml](docs/openapi-example.yaml)
- Exemplos reais: [docs/openapi-exemplos.md](docs/openapi-exemplos.md)
- Postman: [postman/ach-pet.postman_collection.json](postman/ach-pet.postman_collection.json)

## Exemplos de uso

Veja exemplos de requests/responses reais em [docs/openapi-exemplos.md](docs/openapi-exemplos.md).

## Estrutura de Pastas

```text
├── src/
│   ├── domain/         # Entidades, value objects, regras e erros de domínio (NÃO dependem de frameworks)
│   ├── application/    # Use-cases, ports/interfaces, boundaries, presenters (lógica de aplicação)
│   ├── infra/          # Implementações técnicas: repositórios, segurança, uploads, observabilidade
│   ├── presentation/   # Camada HTTP: rotas, middlewares, handlers, validação de payload
│   ├── app.ts          # Composition root: wiring de dependências
│   └── server.ts       # Entrypoint da aplicação Express
│
├── prisma/             # Schema, seeds e migrations do Prisma ORM
├── scripts/            # Scripts utilitários (testes, performance, smoke test)
├── e2e/                # Testes end-to-end (Cypress)
├── postman/            # Coleções e ambientes para testes manuais/automatizados
├── docs/               # Documentação, diagramas, exemplos OpenAPI
├── uploads/            # Pasta para uploads locais (se aplicável)
├── package.json        # Scripts, dependências e metadados do projeto
├── docker-compose.yml  # Orquestração de containers (PostgreSQL, etc)
└── .env.example        # Exemplo de variáveis de ambiente
```

<!--
	Comentário sênior:
	- Cada pasta reflete uma camada da Clean Architecture, facilitando manutenção, testes e evolução.
	- O uso de boundaries e presenters permite múltiplas interfaces (ex: REST, GraphQL, CLI) sem acoplamento.
	- Scripts e documentação separados garantem onboarding rápido e padronização.
-->

## Scripts Customizados

Scripts utilitários para automação e produtividade. Todos podem ser executados via `npm run <script>`.

| Script           | Descrição                                                               |
|:-----------------|:------------------------------------------------------------------------|
| dev              | Sobe API em modo desenvolvimento (hot reload)                           |
| build            | Compila TypeScript para produção                                        |
| start            | Inicia API em produção (após build)                                     |
| lint             | Analisa código com ESLint                                               |
| lint:fix         | Corrige problemas automáticos de lint                                   |
| format           | Formata código com Prettier                                             |
| test             | Executa testes unitários/integrados (Vitest)                            |
| test:watch       | Executa testes em modo watch                                            |
| coverage         | Gera relatório de cobertura de testes                                   |
| smoke            | Executa smoke test básico (scripts/smoke-test.mjs)                      |
| prisma:generate  | Gera client do Prisma                                                   |
| prisma:migrate   | Aplica migrações do banco                                               |
| prisma:seed      | Popula banco com dados de exemplo                                       |
| prisma:studio    | Abre interface visual do Prisma Studio                                  |

### Exemplos de uso de scripts

```sh
# Rodar testes com cobertura
npm run coverage

# Executar smoke test
npm run smoke

# Corrigir problemas de lint automaticamente
npm run lint:fix
```

<!--
	Dica sênior:
	- Scripts customizados facilitam CI/CD, onboarding e manutenção.
	- Sempre documente scripts não triviais no README.
-->

## Testes

- Testes unitários: `src/__tests__` (Vitest)
- Testes integração: `src/__tests__/integration`
- Testes E2E: `e2e/` (Cypress)

## Observabilidade

O projeto já está pronto para monitoramento e tracing em produção:

- **Logs:** via [Pino](https://getpino.io/), já integrado em middlewares e infraestrutura.
- **Métricas Prometheus:** endpoint `/metrics` expõe métricas para scraping por Prometheus.
- **Tracing distribuído:** via [OpenTelemetry](https://opentelemetry.io/), inicializado automaticamente.

### Expondo métricas para Prometheus

- Endpoint: `GET /metrics`
- Exemplo de configuração Prometheus:

```yaml
scrape_configs:
  - job_name: 'ach-pet-api'
    static_configs:
      - targets: ['localhost:3000']
```

### Tracing distribuído (OpenTelemetry)

- O tracing é inicializado automaticamente ao subir a API.
- Para exportar traces para Jaeger, OTLP ou outro backend, configure variáveis de ambiente conforme a documentação do OpenTelemetry Node SDK.

### Logs estruturados

- Todos os logs são emitidos em JSON (produção) ou formatados (dev) via Pino.
- Exemplo de log:

```json
{
  "level": "info",
  "msg": "Usuário autenticado com sucesso",
  "userId": "...",
  "role": "ADOPTER"
}
```

> Consulte `src/infra/observability/` para customização avançada.

## Contribuição

Pull requests e sugestões são bem-vindos!

## Licença

MIT

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
