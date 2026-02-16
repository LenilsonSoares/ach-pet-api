# Exemplos reais de requests/respostas

## POST /auth/register

### Request

```json
{
  "name": "Teste",
  "email": "test1771267190843@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```

### Response

```json
{
  "user": {
    "id": "cmlpir3n60000qww47tyqw0n7",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771267190843@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwaXIzbjYwMDAwcXd3NDd0eXF3MG43Iiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyNjcxOTEsImV4cCI6MTc3MTg3MTk5MX0.7Lr0d_w1v38gPogpY-kEu9vqZwpkFdRrbH-feIiGDUc"
}
```

## POST /auth/login

### Request

```json
{
  "email": "test1771267190843@mail.com",
  "password": "123456"
}
```

### Response

```json
{
  "user": {
    "id": "cmlpir3n60000qww47tyqw0n7",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771267190843@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwaXIzbjYwMDAwcXd3NDd0eXF3MG43Iiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyNjcxOTEsImV4cCI6MTc3MTg3MTk5MX0.7Lr0d_w1v38gPogpY-kEu9vqZwpkFdRrbH-feIiGDUc"
}
```
