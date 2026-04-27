MAIN=src/server.ts
DISPLAY_NAME=Ach Pet API
DESCRIPTION=API do Ach Pet para adocao de pets
MEMORY=1024
VERSION=recommended
SUBDOMAIN=ach-pet-api
START=npx prisma generate && npm run build && npm start
AUTORESTART=true
