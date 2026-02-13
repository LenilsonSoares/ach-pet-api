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
```
Authorization: Bearer <token>
```

## Erros globais
- 400: Payload inválido
- 401: Não autorizado
- 404: Não encontrado
- 422: Erro de validação
- 500: Erro interno

---
Adicione exemplos semelhantes para adoptions, chat, followup.

Esses exemplos podem ser incluídos diretamente no OpenAPI usando o campo `example` em cada schema/response.
