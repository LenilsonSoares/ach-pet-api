# Arquitetura (Clean Architecture) — Ach Pet API

## Visão em camadas

```mermaid
flowchart TB
  subgraph Presentation[Presentation (HTTP/Express)]
    R[Routers]
    MW[Middlewares]
    EH[Error Middleware]
  end

  subgraph Application[Application]
    UC[Use Cases]
    P[Ports / Interfaces]
  end

  subgraph Domain[Domain]
    DERR[Erros / Regras de Domínio]
  end

  subgraph Infra[Infra]
    REPO[Repos Prisma]
    SEC[JWT/Bcrypt]
    ENV[Env]
    DB[(PostgreSQL)]
  end

  Presentation --> UC
  UC --> P
  UC --> Domain

  Infra --> P
  REPO --> DB

  %% exemplos de wiring
  R --> UC
  MW --> UC
  EH --> DERR
```

## Regra de dependência (o que garante “Clean”)

- `domain` não depende de nada.
- `application` depende apenas de `domain` e de **ports** (interfaces), não conhece Express nem Prisma.
- `infra` implementa as interfaces (ports): Prisma/JWT/Bcrypt/Env.
- `presentation` (Express) só faz adaptação HTTP e chama os use cases.

## Onde está no projeto

- Domain: `src/domain`
- Application: `src/application`
- Infra: `src/infra`
- Presentation: `src/presentation`
- Composition Root (wiring): `src/app.ts`
