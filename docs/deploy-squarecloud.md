# Deploy Square Cloud com banco Supabase

## O que falta criar fora do projeto

Crie um projeto no Supabase e use o Postgres dele como banco da API.

No Supabase, abra o painel do projeto, clique em **Connect** e copie a connection string do **Supavisor Session pooler**. Para deploy em servidor como Square Cloud, prefira a string de session pooler com porta `5432`.

Formato esperado:

```env
DATABASE_URL=postgres://prisma.PROJECT_REF:SENHA_DO_BANCO@REGION.pooler.supabase.com:5432/postgres
```

Se voce usar o usuario `postgres` em vez de criar usuario proprio para Prisma, o formato costuma ser:

```env
DATABASE_URL=postgres://postgres.PROJECT_REF:SENHA_DO_BANCO@REGION.pooler.supabase.com:5432/postgres
```

## Variaveis obrigatorias na Square Cloud

```env
PORT=80
HOST=0.0.0.0
NODE_ENV=production
DATABASE_URL=postgres://prisma.PROJECT_REF:SENHA_DO_BANCO@REGION.pooler.supabase.com:5432/postgres
SUPABASE_DATABASE_URL=postgres://prisma.PROJECT_REF:SENHA_DO_BANCO@REGION.pooler.supabase.com:5432/postgres
JWT_SECRET=troque-por-uma-chave-grande-e-segura
JWT_EXPIRES_IN=7d
UPLOADS_DIR=uploads
```

`SUPABASE_DATABASE_URL` e opcional, mas ajuda no deploy da Square: o script de start prefere uma URL do Supabase se alguma variavel antiga da Square ainda aparecer no ambiente.

## Variaveis de banco que devem sair

Se voce saiu do banco PostgreSQL da Square Cloud, remova ou deixe vazias estas variaveis antigas do painel:

```text
PGDATABASE
PGHOST
PGPASSWORD
PGPORT
PGSSLMODE
PGUSER
PRISMA_CLIENT_IDENTITY_P12_BASE64
```

O Supabase normalmente nao precisa do certificado `.p12` usado pelo banco da Square.

## Base64 opcional

Se a Square nao repassar `DATABASE_URL` para o Prisma, configure tambem `ACH_PET_DB_URL_BASE64` com a mesma URL do Supabase convertida para Base64. O script de start cria um `.env` temporario antes de rodar `prisma generate` e `prisma migrate deploy`.

No PowerShell:

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("postgres://prisma.PROJECT_REF:SENHA_DO_BANCO@REGION.pooler.supabase.com:5432/postgres"))
```

Se configurar `SUPABASE_DATABASE_URL`, nao precisa de Base64.

## Variaveis opcionais para upload em nuvem

Se quiser salvar as fotos no Cloudinary, configure tambem:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_FOLDER=ach-pet-api
```

Ou, se preferir cadastrar separado no painel da Square Cloud:

```env
CLOUDINARY_CLOUD_NAME=CLOUD_NAME
CLOUDINARY_API_KEY=API_KEY
CLOUDINARY_API_SECRET=API_SECRET
CLOUDINARY_FOLDER=ach-pet-api
```

Se nem `CLOUDINARY_URL` nem as tres variaveis separadas estiverem configuradas, a API usa upload local em `/uploads`, suficiente para teste e apresentacao.

## Configuracao do app

O arquivo `squarecloud.app` ja esta configurado para:

```ini
START=npm ci --omit=dev --no-audit --no-fund && node scripts/write-prisma-cert.js && npm run prisma:generate && npm run build && npm start
```

O `npm start` roda:

```bash
prisma migrate deploy && node dist/server.js
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
- `DATABASE_URL` do Supabase correta
- se o log insistir em mostrar `square-cloud-db`, configure tambem `SUPABASE_DATABASE_URL` com a mesma URL do Supabase
- banco Supabase ativo
- logs de inicializacao do app
