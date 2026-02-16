# Ports & Interfaces — Camada Application

Este documento descreve as principais interfaces (ports) da camada application, seguindo o padrão Clean Architecture. Essas interfaces definem contratos para repositórios, serviços e provedores, desacoplando regras de negócio das implementações técnicas.

---

## AuthRepository

```ts
export type AuthRepository = {
  findByEmail(email: string): Promise<AuthUser | null>;
  createUser(input: RegisterInput): Promise<PublicUser>;
};
```

- **findByEmail**: Busca usuário pelo e-mail (para login, validação, etc).
- **createUser**: Cria novo usuário e retorna dados públicos.

### Tipos auxiliares (Pets)

- **AuthUser**: Dados completos do usuário para autenticação.
- **PublicUser**: Dados públicos (sem hash de senha).
- **RegisterInput**: Dados necessários para cadastro.

---

## PetsRepository

```ts
export type PetsRepository = {
  list(input: ListPetsInput): Promise<PaginatedPets>;
  getById(id: string): Promise<PetDetails | null>;
  create(input: CreatePetInput): Promise<PetDetails>;
  update(id: string, input: UpdatePetInput): Promise<PetDetails>;
  delete(id: string): Promise<void>;

};
```

- **list**: Lista pets com filtros e paginação.
- **getById**: Busca detalhes de um pet.
- **create**: Cadastra novo pet.
- **update**: Atualiza dados do pet.
- **delete**: Remove pet.

### Tipos auxiliares

- **PetDetails, PetListItem**: Estruturas de dados do pet.
- **CreatePetInput, UpdatePetInput**: Dados para criação/atualização.
- **PaginatedPets**: Retorno paginado.

---

## TokenService

```ts
export type TokenService = {

  signAccessToken(payload: AccessTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
};
```

- **signAccessToken**: Gera token JWT.
- **verifyAccessToken**: Valida e decodifica token JWT.

---

## StorageProvider & StorageService

```ts
export interface StorageProvider {
  upload(file: Buffer, filename: string): Promise<string>;
  delete(filename: string): Promise<void>;
}


export interface StorageService {
  save(file: Buffer, filename: string): Promise<string>;
  remove(filename: string): Promise<void>;
}
```

- **upload/save**: Salva arquivo e retorna URL/caminho.
- **delete/remove**: Remove arquivo.

---

## PasswordHasher

```ts
export type PasswordHasher = {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
};
```

- **hash**: Gera hash seguro da senha.
- **compare**: Compara senha com hash.

---

## Observações

- Todas as interfaces devem ser implementadas na camada infra.
- Use sempre os tipos auxiliares para garantir contratos claros e seguros.
- Para detalhes completos, consulte os arquivos em `src/application/ports/`.
