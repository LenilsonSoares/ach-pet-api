# Exemplos reais de requests/respostas

## POST /auth/register
### Request
```json
{
  "name": "Teste",
  "email": "test1779209800109@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```
### Response
```json
{
  "user": {
    "id": "cmpcvks5m0000qwxwdj79nza1",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1779209800109@mail.com",
    "phone": "77999999999",
    "orgName": null,
    "cpf": "52998224725",
    "birthDate": "10/05/1990",
    "address": "Rua Teste, 123",
    "cnpj": null,
    "responsible": null,
    "site": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBjdmtzNW0wMDAwcXd4d2RqNzluemExIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzkyMDk4MDAsImV4cCI6MTc3OTgxNDYwMH0.e3qqqtySa6NcolKHQMJqFqwMLrkRdjogLeI1DD2fRyk"
}
```
## POST /auth/login
### Request
```json
{
  "email": "test1779209800109@mail.com",
  "password": "123456"
}
```
### Response
```json
{
  "user": {
    "id": "cmpcvks5m0000qwxwdj79nza1",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1779209800109@mail.com",
    "phone": "77999999999",
    "orgName": null,
    "cpf": "52998224725",
    "birthDate": "10/05/1990",
    "address": "Rua Teste, 123",
    "cnpj": null,
    "responsible": null,
    "site": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXBjdmtzNW0wMDAwcXd4d2RqNzluemExIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzkyMDk4MDAsImV4cCI6MTc3OTgxNDYwMH0.e3qqqtySa6NcolKHQMJqFqwMLrkRdjogLeI1DD2fRyk"
}
```
