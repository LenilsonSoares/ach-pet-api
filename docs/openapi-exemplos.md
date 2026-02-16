# Exemplos reais para OpenAPI

## Auth

### /auth/register

- Request:

```json
{
  "role": "ADOPTER",
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "Senha123!",
  "phone": "+5511999999999"
}
```yaml

- Response:

```json
{
  "user": {
    "id": "user-1",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "role": "ADOPTER"
  },
  "token": "eyJhbGciOiJI..."
}
```http

- Erros:
  - 400: Payload inválido
  - 409: Email já cadastrado

### /auth/login

- Request:

```json
{
  "email": "maria@email.com",
  "password": "Senha123!"
}
```

- Response:

```json
{
  "user": {
    "id": "user-1",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "role": "ADOPTER"
  },
  "token": "eyJhbGciOiJI..."
}
```

- Erros:
  - 401: Credenciais inválidas

## Pets

### /pets (GET)

- Response:

```json
{
  "pets": [
    {
      "id": "pet-1",
      "name": "Rex",
      "species": "dog",
      "status": "AVAILABLE",
      "shelterId": "shelter-1",
      "photos": [{ "id": "photo-1", "url": "https://..." }],
      "createdAt": "2026-02-13T10:00:00Z"
    }
  ]
}
```

### /pets (POST)

- Request:

```json
{
  "name": "Rex",
  "species": "dog",
  "breed": "vira-lata",
  "sex": "male",
  "ageMonths": 24,
  "size": "medium",
  "description": "Muito dócil"
}
```

- Response:

```json
{
  "id": "pet-1",
  "name": "Rex",
  "species": "dog",
  "status": "AVAILABLE",
  "shelterId": "shelter-1",
  "photos": [],
  "createdAt": "2026-02-13T10:00:00Z"
}
```

- Erros:
  - 401: Não autorizado

### /pets/{id} (GET)

- Response:

```json
{
  "id": "pet-1",
  "name": "Rex",
  "species": "dog",
  "status": "AVAILABLE",
  "shelterId": "shelter-1",
  "photos": [{ "id": "photo-1", "url": "https://..." }],
  "createdAt": "2026-02-13T10:00:00Z"
}
```

- Erros:
  - 404: Pet não encontrado


## Autenticação

- Todos endpoints protegidos exigem header:

```http
Authorization: Bearer <token>
```

## Erros globais

- 400: Payload inválido
- 401: Não autorizado
- 404: Não encontrado
- 422: Erro de validação
- 500: Erro interno

## Adoptions

### /adoptions/requests (POST)

- Request:

```json
{
  "petId": "pet-1",
  "message": "Gostaria de adotar o Rex!"
}
```

- Response:

```json
{
  "id": "adoption-request-1",
  "petId": "pet-1",
  "adopterId": "user-2",
  "shelterId": "user-1",
  "status": "PENDING",
  "createdAt": "2026-02-13T10:10:00Z"
}
```

- Erros:
  - 401: Não autorizado
  - 404: Pet não encontrado

### /adoptions/requests/mine (GET)

- Response:

```json
{
  "requests": [
    {
      "id": "adoption-request-1",
      "petId": "pet-1",
      "status": "PENDING",
      "createdAt": "2026-02-13T10:10:00Z"
    }
  ]
}
```

## Chat

### /chat/threads/{threadId}/messages (GET)

- Response:

```json
{
  "messages": [
    {
      "id": "msg-1",
      "threadId": "thread-1",
      "senderId": "user-1",
      "content": "Olá, tudo bem?",
      "createdAt": "2026-02-13T11:00:00Z"
    }
  ]
}
```

### /chat/threads/{threadId}/messages (POST)

- Request:

```json
{
  "content": "Olá, tudo bem?"
}
```

- Response:

```json
{
  "id": "msg-1",
  "threadId": "thread-1",
  "senderId": "user-1",
  "content": "Olá, tudo bem?",
  "createdAt": "2026-02-13T11:00:00Z"
}
```

## Followup

### /followup/adoptions/{adoptionId}/updates (POST)

- Request:

```json
{
  "text": "O pet está se adaptando bem!",
  "photoUrl": "https://..."
}
```

- Response:

```json
{
  "id": "update-1",
  "adoptionId": "adoption-1",
  "authorId": "user-2",
  "text": "O pet está se adaptando bem!",
  "photoUrl": "https://...",
  "createdAt": "2026-02-13T12:00:00Z"
}
```

- Erros:
  - 401: Não autorizado
  - 404: Adoção não encontrada
