# Deploy Square Cloud

## O que falta criar fora do projeto

Crie um banco PostgreSQL na Square Cloud.

Depois copie a connection string PostgreSQL e configure no painel da Square Cloud como `DATABASE_URL`.

## Variaveis obrigatorias na Square Cloud

```env
PORT=80
HOST=0.0.0.0
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=troque-por-uma-chave-grande-e-segura
JWT_EXPIRES_IN=7d
UPLOADS_DIR=uploads
```

## Variaveis opcionais para upload em nuvem

Se quiser salvar as fotos no Cloudinary, configure tambem:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_FOLDER=ach-pet-api
```

Se `CLOUDINARY_URL` nao estiver configurada, a API usa upload local em `/uploads`, suficiente para teste e apresentacao.

## Configuracao do app

O arquivo `squarecloud.app` ja esta configurado para:

```ini
START=npx prisma generate && npm run build && npm start
```

O `npm start` roda:

```bash
npx prisma migrate deploy && node dist/server.js
```

Ou seja: quando a Square Cloud iniciar o app, as migrations do Prisma serao aplicadas automaticamente no banco configurado em `DATABASE_URL`.

## Validacao depois do deploy

Abra:

```text
https://ach-pet-api.squareweb.app/health
```

Resposta esperada:

```json
{"ok":true}
```

Se retornar timeout 408, confira no painel:

- `PORT=80`
- `HOST=0.0.0.0`
- `DATABASE_URL` correta
- banco PostgreSQL ativo e acessivel externamente
- logs de inicializacao do app
