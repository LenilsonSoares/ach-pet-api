# Exemplos reais de requests/respostas

## POST /auth/register
### Request
```json
{
  "name": "Teste",
  "email": "test1779319178053@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```
### Response
```json
{
  "user": {
    "id": "cmpeop4qm0000ogm0um2hbp5y",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1779319178053@mail.com",
    "phone": "77999999999",
    "orgName": null,
    "cpf": "52998224725",
    "birthDate": "10/05/1990",
    "address": "Rua Teste, 123",
    "cnpj": null,
    "responsible": null,
    "site": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBlb3A0cW0wMDAwb2dtMHVtMmhicDV5Iiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzkzMTkxODAsImV4cCI6MTc3OTkyMzk4MH0.VtOdl98b2HuCCN44iU7bULXuXNCv0kzZ9V1TjvNOaD4"
}
```
## POST /auth/login
### Request
```json
{
  "email": "test1779319178053@mail.com",
  "password": "123456"
}
```
### Response
```json
{
  "user": {
    "id": "cmpeop4qm0000ogm0um2hbp5y",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1779319178053@mail.com",
    "phone": "77999999999",
    "orgName": null,
    "cpf": "52998224725",
    "birthDate": "10/05/1990",
    "address": "Rua Teste, 123",
    "cnpj": null,
    "responsible": null,
    "site": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBlb3A0cW0wMDAwb2dtMHVtMmhicDV5Iiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzkzMTkxODAsImV4cCI6MTc3OTkyMzk4MH0.VtOdl98b2HuCCN44iU7bULXuXNCv0kzZ9V1TjvNOaD4"
}
```
