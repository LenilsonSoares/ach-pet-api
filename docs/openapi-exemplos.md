# Exemplos reais de requests/respostas

## POST /auth/register

### Register Request

```json
{
  "name": "Teste",
  "email": "test1771265597559@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```

### Register Response

```json
{
  "user": {
    "id": "cmlphsyab0000qwrsje2e2634",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771265597559@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwaHN5YWIwMDAwcXdyc2plMmUyNjM0Iiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyNjU1OTcsImV4cCI6MTc3MTg3MDM5N30.JUrOqqifTMZQcVONQqSctmMk5BB1kRcAcIrlTbcgFrY"
}
```

## POST /auth/login

### Login Request

```json
{
  "email": "test1771265597559@mail.com",
  "password": "123456"
}
```

### Login Response

```json
{
  "user": {
    "id": "cmlphsyab0000qwrsje2e2634",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771265597559@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwaHN5YWIwMDAwcXdyc2plMmUyNjM0Iiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyNjU1OTcsImV4cCI6MTc3MTg3MDM5N30.JUrOqqifTMZQcVONQqSctmMk5BB1kRcAcIrlTbcgFrY"
}
```
