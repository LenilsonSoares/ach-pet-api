#!/bin/bash
# Script: test-before-push.sh
# Uso: ./test-before-push.sh

set -e

# 1. Sobe o banco de dados local (ignora erro se já existe)
docker run --name achpet_test -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=achpet_test -p 5432:5432 -d postgres:15 || true

# 2. Espera o banco ficar pronto
npx wait-on tcp:5432

# 3. Roda as migrations
npx prisma migrate deploy

# 4. Roda lint geral e E2E
npm run lint:all
npm run lint:e2e

# 5. Roda build e testes de integração
npm run build
npm run test:integration:full

echo "\n✅ Tudo OK para dar push!"
