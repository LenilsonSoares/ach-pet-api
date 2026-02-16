# Guia Completo: Testando a API no Postman

## 1. Preparação

### 1.1. Instale o Postman

Baixe e instale o Postman: <https://www.postman.com/downloads/>

### 1.2. Inicie a API

Certifique-se que a API está rodando:

```js
powershell
npm run dev
```js

Acesse: <http://localhost:3000>

## 2. Importando Coleção e Ambiente

### 2.1. Coleção

- Abra o Postman
- Clique em "Import"
- Selecione o arquivo: `postman/ach-pet.postman_collection.json`

### 2.2. Ambiente

- Clique em "Import"
- Selecione o arquivo: `postman/ach-pet.postman_environment.json`
- Ative o ambiente (canto superior direito)

## 3. Testando Endpoints

### 3.1. Autenticação

- `POST /auth/register`: Crie usuário (adotante ou abrigo)
- `POST /auth/login`: Faça login e obtenha token JWT

### 3.2. Pets

- `POST /pets`: Crie pet (abrigo)
- `GET /pets`: Liste pets
- `GET /pets/{id}`: Detalhe do pet
- `POST /pets/{id}/favorite`: Favoritar pet (adotante)
- `POST /pets/{id}/unfavorite`: Remover favorito

### 3.3. Adoção

- `POST /adoptions/request`: Solicite adoção (adotante)
- `GET /adoptions/inbox`: Abrigo vê solicitações
- `POST /adoptions/{id}/approve`: Abrigo aprova
- `POST /adoptions/{id}/reject`: Abrigo rejeita

### 3.4. Chat

- `POST /chat/send`: Envie mensagem
- `GET /chat/messages`: Liste mensagens

### 3.5. Followup

- `POST /followup/update`: Crie atualização pós-adoção
- `GET /followup/updates`: Liste atualizações

## 4. Como Usar

- Para endpoints protegidos, use o token JWT obtido no login.
- No Postman, configure o token em "Authorization" (Bearer Token) ou diretamente no header `Authorization: Bearer <token>`.
- Use os exemplos da coleção para cada rota.
- Valide respostas, status HTTP e mensagens de erro.

## 5. Testes Automatizados

- No Postman, clique em "Runner" (canto superior esquerdo).
- Selecione a coleção e ambiente.
- Execute todos os testes.
- Veja o resultado dos scripts de teste (validação automática).

## 6. Dicas

- Use o ambiente para trocar URLs e tokens facilmente.
- Edite variáveis do ambiente conforme necessário.
- Para integração contínua, use o Newman (CLI do Postman):

```js

npx newman run postman/ach-pet.postman_collection.json -e postman/ach-pet.postman_environment.json

```

## 7. Troubleshooting

- Se algum endpoint falhar, verifique o token, dados enviados e status do servidor.
- Consulte a documentação Swagger em: <http://localhost:3000/docs>

---

Com esse guia, você consegue testar toda a API, validar fluxos completos e garantir a qualidade do backend. Se precisar de exemplos de scripts de teste ou integração com CI, posso gerar!
