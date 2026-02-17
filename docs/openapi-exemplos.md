# Exemplos reais de requests/respostas

## POST /auth/register
### Request
```json
{
  "name": "Teste",
  "email": "test1771284538164@mail.com",
  "password": "123456",
  "role": "ADOPTER"
}
```
### Response
```json
{
  "user": {
    "id": "cmlpt2wt10000ogoki5lurwln",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771284538164@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwdDJ3dDEwMDAwb2dva2k1bHVyd2xuIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyODQ1MzgsImV4cCI6MTc3MTg4OTMzOH0.vv7cIXMF0MqqGYfiiW362-NzrN-lRbI-PNAn1pxw0t0"
}
```
## POST /auth/login
### Request
```json
{
  "email": "test1771284538164@mail.com",
  "password": "123456"
}
```
### Response
```json
{
  "user": {
    "id": "cmlpt2wt10000ogoki5lurwln",
    "role": "ADOPTER",
    "name": "Teste",
    "email": "test1771284538164@mail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWxwdDJ3dDEwMDAwb2dva2k1bHVyd2xuIiwicm9sZSI6IkFET1BURVIiLCJpYXQiOjE3NzEyODQ1MzgsImV4cCI6MTc3MTg4OTMzOH0.vv7cIXMF0MqqGYfiiW362-NzrN-lRbI-PNAn1pxw0t0"
}
```
