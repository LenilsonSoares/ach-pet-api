# Exemplos reais de requests/respostas

## POST /auth/register
### Request
```json
{
  "name": "Teste",
  "email": "test1779320301828@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```
### Response
```json
{
  "user": {
    "id": "cmpepd7ro0000ogkwvl9qxxdj",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1779320301828@mail.com",
    "phone": "77999999999",
    "orgName": null,
    "cpf": "52998224725",
    "birthDate": "10/05/1990",
    "address": "Rua Teste, 123",
    "cnpj": null,
    "responsible": null,
    "site": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBlcGQ3cm8wMDAwb2drd3ZsOXF4eGRqIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzkzMjAzMDEsImV4cCI6MTc3OTkyNTEwMX0.IxWVb3hA0TdtC9zyp4vr6SJKCjI9fwME5L_0U2HKGXQ"
}
```
## POST /auth/login
### Request
```json
{
  "email": "test1779320301828@mail.com",
  "password": "123456"
}
```
### Response
```json
{
  "user": {
    "id": "cmpepd7ro0000ogkwvl9qxxdj",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1779320301828@mail.com",
    "phone": "77999999999",
    "orgName": null,
    "cpf": "52998224725",
    "birthDate": "10/05/1990",
    "address": "Rua Teste, 123",
    "cnpj": null,
    "responsible": null,
    "site": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBlcGQ3cm8wMDAwb2drd3ZsOXF4eGRqIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzkzMjAzMDIsImV4cCI6MTc3OTkyNTEwMn0.ObXDQQ0gn2HAVYGRyd48c3CFuaavSYwJDilSgVHDoX0"
}
```
