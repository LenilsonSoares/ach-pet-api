# Handoff Mobile (React Native + Expo) — Ach Pet

Este documento serve para o Alex implementar o app mobile consumindo a Ach Pet API.

## 1) Setup do projeto (Expo)

### Criar projeto

```bash
npx create-expo-app ach-pet-mobile -t expo-template-blank-typescript
cd ach-pet-mobile
```

### Dependências sugeridas (mínimas)

```bash
npm i @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npm i zod
npx expo install expo-secure-store
```

> `expo-secure-store`: guardar token com segurança no dispositivo.

### Configuração de API Base URL

- Emulador Android: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`
- Celular físico: `http://SEU_IP_LOCAL:3000` (PC e celular na mesma rede)

Crie um arquivo (exemplo):

- `src/config.ts`: `export const API_BASE_URL = "http://10.0.2.2:3000";`

## 2) Telas mínimas (MVP) por perfil

### Telas comuns

- **Login**
- **Cadastro** (seleciona perfil: ADOPTER ou SHELTER)

### Fluxo ADOPTER

- **Lista de Pets** (com filtro simples)
- **Detalhe do Pet** (favoritar + solicitar adoção)
- **Minhas Solicitações** (ver status; abrir chat/follow-up quando aprovado)
- **Chat** (após aprovado)
- **Acompanhamento** (lista de updates + criar update)

### Fluxo SHELTER

- **Meus Pets** (lista simples + criar pet)
- **Criar Pet**
- **Inbox de Solicitações** (aprovar/rejeitar)
- **Chat** (após aprovado)
- **Acompanhamento** (ver updates)

## 3) Contratos de API (o que chamar em cada tela)

## 3.1) Configuração completa do `API_BASE_URL` (local / faculdade / produção)

O app precisa de um `API_BASE_URL` (string) para montar as URLs:

- Ex.: `https://xxxx.trycloudflare.com`

### Regra prática

- **Expo (dev):** dá para trocar o `API_BASE_URL` e reiniciar o app.
- **APK (build):** o `API_BASE_URL` normalmente fica “gravado” no build se estiver hardcoded.

Como o **Quick Tunnel** muda a URL sempre que você fecha/abre o túnel, o ideal é deixar o `API_BASE_URL` **configurável por ambiente**.

### Sugestão simples (Expo): variável `EXPO_PUBLIC_API_BASE_URL`

No front, ao invés de fixar o valor, leia de env e tenha fallback.

Exemplo (em `src/config.ts` no app):

```ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.0.2.2:3000";
```

#### Para rodar local (dev)

- Android emulator: `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000`
- iOS simulator: `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000`

#### Para rodar na faculdade (APK/celular) usando túnel HTTPS

1) Suba a API no notebook: `npm run dev`
2) Crie o túnel no notebook: `cloudflared tunnel --url http://localhost:3000`
3) Copie a URL gerada (ex.: `https://xxxx.trycloudflare.com`)
4) No front, configure o `EXPO_PUBLIC_API_BASE_URL` para essa URL

Teste no celular:

- Acessar `https://xxxx.trycloudflare.com/health` deve retornar `{ "ok": true }`

### Imagens no mobile

As imagens salvas no backend ficam com URL relativa, por exemplo:

- `photoUrl: "/uploads/arquivo.jpg"`

No app, para exibir a imagem, monte a URL completa:

- `${API_BASE_URL}${photoUrl}`

### Observação importante (APK)

Se você gerar um APK com `API_BASE_URL` hardcoded, e depois o túnel mudar de URL, você vai precisar **rebuildar o APK**.

Por isso, para apresentação na faculdade, prefira:

- ler de `EXPO_PUBLIC_API_BASE_URL` (config por ambiente), ou
- usar backend publicado com URL fixa `https://...`.

### Auth

#### Cadastro (POST /auth/register)

- Body (SHELTER):

```json
{
  "role": "SHELTER",
  "name": "ONG Exemplo",
  "email": "email@dominio.com",
  "password": "123456",
  "phone": "11999999999",
  "orgName": "ONG Exemplo"
}
```

- Body (ADOPTER):

```json
{
  "role": "ADOPTER",
  "name": "Pessoa",
  "email": "email@dominio.com",
  "password": "123456",
  "phone": "11988888888"
}
```

- Response:

```json
{ "user": { "id": "...", "role": "...", "name": "...", "email": "..." }, "token": "..." }
```

#### Login (POST /auth/login)

- Body:

```json
{ "email": "...", "password": "..." }
```

- Response:

```json
{ "user": { "id": "...", "role": "...", "name": "...", "email": "..." }, "token": "..." }
```

### Pets

#### Listagem (GET /pets)

- Query (opcional): `status`, `species`, `q`, `page`, `pageSize`, `order` (`asc`|`desc`)
- Response:

```json
{ "pets": [ { "id": "...", "name": "...", "status": "AVAILABLE", "photos": [ {"url": "/uploads/..."} ] } ] }
```

> Observação (erros): quando der erro, o backend retorna no padrão:

```json
{ "error": { "message": "...", "code": "...", "issues": [] } }
```

#### Detalhe (GET /pets/:id)

- Response: `{ "pet": { ... } }`

#### Favoritar (ADOPTER)

- `POST /pets/:id/favorite` com header `Authorization: Bearer <token>`
- `DELETE /pets/:id/favorite`

#### Criar pet (SHELTER)

- `POST /pets` com token do abrigo

#### Meus pets (SHELTER)

- `GET /pets/mine` com token do abrigo

#### Atualizar/pausar pet (SHELTER)

- `PATCH /pets/:id` com token do abrigo
- Body (envie 1+ campos):

```json
{ "name": "Novo nome", "description": "...", "status": "PAUSED" }
```

- `status`: `AVAILABLE` | `PAUSED`

#### Enviar foto (SHELTER)

- `POST /pets/:id/photos` `multipart/form-data` campo `photo`
- A URL fica acessível via `GET {API_BASE_URL}/uploads/<arquivo>`

### Adoções

#### Criar solicitação (ADOPTER)

- `POST /adoptions/requests`
- Body:

```json
{ "petId": "...", "message": "..." }
```

#### Minhas solicitações (ADOPTER)

- `GET /adoptions/requests/mine`
- Response inclui (quando aprovado): `adoption.thread.id` e `adoption.id`

#### Inbox (SHELTER)

- `GET /adoptions/requests/inbox`

#### Aprovar (SHELTER)

- `POST /adoptions/requests/:id/approve`
- Body opcional:

```json
{ "followUpDays": 14 }
```

- Response:

```json
{ "adoption": { "id": "...", "thread": { "id": "..." }, "followUpDays": 14 } }
```

#### Rejeitar (SHELTER)

- `POST /adoptions/requests/:id/reject`

#### Intervir na adoção (SHELTER)

- `POST /adoptions/:adoptionId/intervene`
- Response:

```json
{ "adoption": { "id": "...", "status": "INTERVENTION" } }
```

### Chat (após aprovação)

#### Listar mensagens

- `GET /chat/threads/:threadId/messages`

#### Enviar mensagem

- `POST /chat/threads/:threadId/messages`
- Body:

```json
{ "content": "..." }
```

### Acompanhamento (follow-up)

#### Listar updates

- `GET /followup/adoptions/:adoptionId/updates`

#### Criar update

- `POST /followup/adoptions/:adoptionId/updates`
- Body:

```json
{ "text": "...", "photoUrl": "/uploads/arquivo.jpg" }
```

## 4) Regras de autenticação (importante)

- Toda rota protegida deve enviar: `Authorization: Bearer <token>`
- `ADOPTER` e `SHELTER` têm permissões diferentes.

## 5) Estrutura sugerida do app

- `src/config.ts` (baseUrl)
- `src/api/http.ts` (fetch wrapper)
- `src/auth/session.ts` (SecureStore: salvar/ler token + user)
- `src/screens/...` (telas)
- `src/navigation/...` (stack)

## 6) Fluxo de demo (para apresentação)

1) Abrigo loga e cria pet.
2) Adotante loga, lista pets, solicita adoção.
3) Abrigo aprova na inbox.
4) Adotante abre chat e manda mensagem.
5) Adotante manda update no acompanhamento.
