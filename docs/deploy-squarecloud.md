# Deploy Square Cloud

## O que falta criar fora do projeto

Crie um banco PostgreSQL na Square Cloud.

Depois copie a connection string PostgreSQL e configure no painel da Square Cloud como `DATABASE_URL`.

Para Prisma/PostgreSQL, inclua o nome do database na URL. Se voce nao criou um database especifico, use `squarecloud`.

## Variaveis obrigatorias na Square Cloud

```env
PORT=80
HOST=0.0.0.0
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/squarecloud?schema=public
JWT_SECRET=troque-por-uma-chave-grande-e-segura
JWT_EXPIRES_IN=7d
UPLOADS_DIR=uploads
```

## Certificado SSL/TLS do banco

A Square Cloud pode exigir certificado para conexao PostgreSQL. No Prisma v6, baixe o `certificate.pem` no painel do banco, separe o certificado e a chave em `cert.pem` e `key.pem`, gere um `.p12` e coloque em `prisma/certs/client-identity.p12`.

```bash
openssl pkcs12 -export -out prisma/certs/client-identity.p12 -inkey prisma/certs/key.pem -in prisma/certs/cert.pem
```

Depois ajuste a URL no painel da aplicacao:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/squarecloud?schema=public&sslidentity=./certs/client-identity.p12&sslpassword=SENHA_DO_P12
```

Arquivos dentro de `prisma/certs/` ficam ignorados pelo Git porque podem conter segredo.

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
