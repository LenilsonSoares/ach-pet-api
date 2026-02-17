# Exemplos reais de requests/respostas

## POST /auth/register
### Request
```json
{
  "name": "Teste",
  "email": "test1771289703245@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```
### Response
```json
{
  "user": {
    "id": "cmlpw5m7l0000ogukvlawffa0",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771289703245@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwdzVtN2wwMDAwb2d1a3ZsYXdmZmEwIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyODk3MDMsImV4cCI6MTc3MTg5NDUwM30.QRIpOrXJdHpTslBpYD2SuWSOB1qIOoQwo_EAtCUu5Ss"
}
```
## POST /auth/login
### Request
```json
{
  "email": "test1771289703245@mail.com",
  "password": "123456"
}
```
### Response
```json
{
  "user": {
    "id": "cmlpw5m7l0000ogukvlawffa0",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771289703245@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwdzVtN2wwMDAwb2d1a3ZsYXdmZmEwIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyODk3MDMsImV4cCI6MTc3MTg5NDUwM30.QRIpOrXJdHpTslBpYD2SuWSOB1qIOoQwo_EAtCUu5Ss"
}
```
