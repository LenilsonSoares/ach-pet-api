# Exemplos reais de requests/respostas

## POST /auth/register

### Request

```json
{
  "name": "Teste",
  "email": "test1771289947116@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```

### Response

```json
{
  "user": {
    "id": "cmlpwaudv0000ogw8yrv04vzq",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771289947116@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwd2F1ZHYwMDAwb2d3OHlydjA0dnpxIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyODk5NDcsImV4cCI6MTc3MTg5NDc0N30.pm2-h9ayjqeW8ylSTmP-EPpdOpeTfEo5igSKkew00UQ"
}
```

## POST /auth/login

### Request

```json
{
  "email": "test1771289947116@mail.com",
  "password": "123456"
}
```

### Response

```json
{
  "user": {
    "id": "cmlpwaudv0000ogw8yrv04vzq",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771289947116@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwd2F1ZHYwMDAwb2d3OHlydjA0dnpxIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyODk5NDcsImV4cCI6MTc3MTg5NDc0N30.pm2-h9ayjqeW8ylSTmP-EPpdOpeTfEo5igSKkew00UQ"
}
```
