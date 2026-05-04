# Relatorio de Sprint - Projeto AchPet

## Sprint 2 - Integracao em Desenvolvimento

**Periodo:** 14 de abril de 2026 a 28 de abril de 2026

## Observacao de Alinhamento

Este relatorio complementa o documento inicial enviado pela equipe para a Sprint 2. Como algumas atividades foram desenvolvidas em paralelo e houve pouca comunicacao entre os integrantes durante a sprint, parte do que foi implementado tecnicamente nao apareceu de forma completa no PDF original.

Por isso, esta versao registra o estado mais atualizado do projeto, considerando o que foi identificado no repositorio, no backend, no banco de dados e nos ajustes de integracao com o frontend. A intencao nao e substituir o trabalho ja enviado pela equipe, mas atualizar a OAT com uma visao mais fiel das entregas realizadas.

Tambem houve mudanca na estrategia de infraestrutura. Inicialmente foram consideradas alternativas como Railway para deploy e Supabase para banco de dados, mas, por falta de alinhamento e pelo prazo curto da entrega, a decisao atual e concentrar o deploy da aplicacao e o banco PostgreSQL na Square Cloud. Essa escolha reduz o numero de servicos externos envolvidos e facilita a configuracao final do ambiente.

## 1. Objetivo da Sprint

O objetivo da Sprint 2 foi avancar na integracao do sistema AchPet, conectando o aplicativo mobile ao backend, consolidando a estrutura do banco de dados e evoluindo as principais regras de negocio da aplicacao.

Nesta sprint, o projeto deixou de ser apenas uma proposta com telas isoladas e passou a ter uma base tecnica mais completa, com API, banco relacional, autenticacao, rotas principais e inicio da integracao com o frontend mobile.

## 2. Atividades Planejadas

- Integrar o frontend mobile com a API.
- Estruturar o banco de dados do projeto.
- Desenvolver as principais funcoes do backend.
- Implementar autenticacao de usuarios.
- Criar regras de negocio para adotantes, abrigos, pets e solicitacoes de adocao.
- Iniciar testes funcionais dos fluxos principais.
- Organizar as responsabilidades da equipe para a fase de integracao.

## 3. Atividades Executadas

### Backend e API

- Desenvolvimento da API com Node.js, TypeScript e Express.
- Organizacao do backend seguindo principios de Clean Architecture.
- Separacao do projeto em camadas de dominio, aplicacao, infraestrutura e apresentacao HTTP.
- Implementacao de autenticacao com JWT.
- Implementacao de criptografia de senhas com bcrypt.
- Criacao das rotas de cadastro e login.
- Criacao das rotas de listagem, cadastro, atualizacao e gerenciamento de pets.
- Criacao do fluxo de favoritos para adotantes.
- Criacao das rotas de solicitacao de adocao.
- Criacao das rotas de aprovacao e rejeicao de solicitacoes pelo abrigo.
- Estruturacao inicial do chat entre adotante e abrigo.
- Estruturacao do acompanhamento pos-adocao.
- Configuracao de middlewares de seguranca, CORS, logs, limite de requisicoes e tratamento centralizado de erros.
- Configuracao de documentacao da API com OpenAPI/Swagger.

### Banco de Dados

- Implementacao do banco relacional usando PostgreSQL.
- Configuracao do Prisma ORM.
- Criacao do schema principal do banco.
- Modelagem das entidades principais do sistema:
  - Usuario
  - Perfil de abrigo
  - Perfil de adotante
  - Pet
  - Fotos do pet
  - Favoritos
  - Solicitacao de adocao
  - Adocao
  - Conversa/chat
  - Mensagens
  - Atualizacoes de acompanhamento pos-adocao
- Criacao de relacionamentos, indices, enums e regras de integridade.
- Preparacao de migrations e seed para dados iniciais.

### Frontend Mobile

- Finalizacao das principais telas mobile em React Native/Expo.
- Entrega da base do frontend para integracao com a API.
- Ajustes na navegacao principal do aplicativo.
- Ajustes de comunicacao entre frontend e backend.
- Configuracao do servico de API no frontend.
- Mapeamento dos dados recebidos da API para uso nas telas.
- Manutencao de dados simulados como fallback durante a fase de integracao.
- Fluxos trabalhados:
  - Login
  - Cadastro
  - Home do adotante
  - Home do abrigo
  - Listagem de pets
  - Detalhes do pet
  - Favoritos
  - Solicitacoes de adocao
  - Gerenciamento de pets pelo abrigo
  - Chat

### Integracao

- Inicio da ligacao real entre o aplicativo mobile e a API.
- Configuracao de URL base para execucao local e Android/Expo.
- Ajustes nos fluxos de cadastro, login, pets, favoritos, solicitacoes e chat.
- Identificacao dos pontos que ainda precisam de validacao com banco local ativo.

### Infraestrutura e Deploy

- Avaliacao inicial de deploy em Railway.
- Avaliacao de banco externo em Supabase como alternativa para PostgreSQL.
- Mudanca de estrategia para utilizar Square Cloud no deploy da aplicacao.
- Planejamento para utilizar banco PostgreSQL tambem na Square Cloud.
- Manutencao da arquitetura com Prisma e PostgreSQL, trocando apenas a URL de conexao do banco conforme o ambiente.
- Reducao de risco operacional ao concentrar aplicacao e banco em uma mesma plataforma para a entrega.

## 4. Situacao Atual da Sprint

A Sprint 2 avancou alem do planejamento inicial. O frontend ja possui telas principais implementadas e o backend foi estruturado com banco de dados, autenticacao, regras de negocio e rotas essenciais.

O projeto esta em fase de integracao e validacao. As principais bases tecnicas ja existem, mas ainda e necessario testar todos os fluxos com o banco local ativo, corrigir inconsistencias entre frontend e backend e melhorar a experiencia do usuario antes da entrega final.

Em relacao ao PDF original da equipe, a principal diferenca e que o documento inicial tratava backend e banco de dados como atividades ainda em inicio de desenvolvimento. Na pratica, durante a Sprint 2 ja havia uma base funcional de API, modelagem com Prisma/PostgreSQL e parte da comunicacao com o frontend, restando principalmente validacao, testes completos e ajustes de integracao.

Outra diferenca foi a decisao de infraestrutura. O planejamento inicial ainda nao estava fechado entre Railway, Supabase e outras opcoes. No estado atual, por questao de prazo e simplicidade, o caminho definido e fazer o deploy na Square Cloud e usar o PostgreSQL da propria Square Cloud, mantendo a mesma estrutura de banco ja preparada no Prisma.

## 5. Pendencias Identificadas

- Finalizar a validacao completa da integracao entre frontend e backend.
- Testar o fluxo completo de cadastro, login, listagem de pets, solicitacao de adocao, aprovacao e chat.
- Subir o PostgreSQL local via Docker antes de executar os testes integrados.
- Rodar migrations e seed do Prisma em ambiente local.
- Corrigir ajustes visuais e pequenos bugs nas telas mobile.
- Melhorar mensagens de erro e feedback visual no aplicativo.
- Validar upload de imagens dos pets.
- Ajustar configuracao de lint para separar corretamente backend TypeScript e frontend React Native/JSX.
- Revisar textos e possiveis problemas de acentuacao em arquivos do projeto.
- Preparar evidencias para apresentacao, como prints, fluxo funcionando e explicacao tecnica.

## 6. Atividades Planejadas para a Proxima Sprint

- Executar o ambiente completo com Docker, PostgreSQL, backend e frontend.
- Reexecutar os testes automatizados com o banco de dados ativo.
- Corrigir falhas encontradas nos testes de integracao.
- Criar e configurar o banco PostgreSQL na Square Cloud.
- Atualizar as variaveis de ambiente de producao com a URL real do banco da Square Cloud.
- Realizar deploy da API na Square Cloud.
- Finalizar a comunicacao entre todas as telas do frontend e a API.
- Validar o fluxo do adotante do cadastro ate a solicitacao de adocao.
- Validar o fluxo do abrigo do cadastro ate a aprovacao ou rejeicao de solicitacoes.
- Validar o funcionamento do chat.
- Finalizar upload e exibicao de imagens dos pets.
- Melhorar a interface mobile para ficar mais consistente e profissional.
- Atualizar a documentacao tecnica do projeto.
- Preparar a apresentacao da sprint com demonstracao do sistema funcionando.

## 7. Divisao de Responsabilidades

- **Backend / API:** Lenilson Soares.
- **Banco de dados / Prisma / PostgreSQL:** Lenilson Soares, com apoio na modelagem.
- **Frontend mobile:** Alex Oliveira.
- **Ajustes de integracao frontend-backend:** Lenilson Soares.
- **Documentacao / Analise:** Ana Clara Ribeiro.
- **Testes / Qualidade:** Alice Aragao.
- **Apoio da equipe:** revisao de requisitos, validacao dos fluxos e acompanhamento das tarefas.

## 8. Consideracoes Finais

A Sprint 2 foi importante porque consolidou a base tecnica do AchPet. O sistema passou a ter uma estrutura mais proxima de uma aplicacao real, com backend organizado, banco de dados relacional, autenticacao, regras de negocio e telas mobile em processo de integracao.

Mesmo com algumas pendencias, o projeto evoluiu bem e o principal foco da proxima sprint sera estabilizar os fluxos completos, corrigir erros de integracao e preparar uma demonstracao funcional para a avaliacao.
