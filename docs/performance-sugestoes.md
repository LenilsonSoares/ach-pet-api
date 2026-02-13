# Sugestões para performance

- Monitore endpoints críticos (ex: /pets, /auth/login, /adoptions) usando Prometheus e logs.
- Ajuste limites de carga no autocannon conforme resultados:
  - connections: 10-100 (conforme infra)
  - duration: 10-60s
  - endpoints: /pets, /auth/login, /adoptions, /chat
- Use métricas para identificar gargalos (latência, throughput, erros).
- Ajuste pool de conexões do Prisma conforme demanda.
- Para produção, configure alertas para latência alta e erros.

Exemplo de autocannon:
```bash
autocannon -c 50 -d 30 http://localhost:3000/pets
```

Exemplo de ajuste no Prisma:
```js
// prisma.ts
export const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
  log: ["query", "info", "warn", "error"],
  // pool: { min: 2, max: 10 } // ajuste conforme infra
});
```

---
Reveja resultados dos testes e ajuste limites conforme infra disponível.
