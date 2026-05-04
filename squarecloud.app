MAIN=dist/server.js
MEMORY=512
VERSION=recommended
DISPLAY_NAME=ach-pet-api
# O comando START deve garantir o migrate
START=npx prisma migrate deploy && node dist/server.js

