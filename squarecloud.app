MAIN=src/server.ts
MEMORY=1024
VERSION=recommended
DISPLAY_NAME=ach-pet-api
DESCRIPTION=API Ach Pet
SUBDOMAIN=ach-pet-api
AUTORESTART=true
# Gera Prisma Client, compila TypeScript, aplica migrations e inicia a API
START=npm install --include=dev --no-audit --no-fund && node scripts/write-prisma-cert.js && npx prisma generate && npm run build && npm start

