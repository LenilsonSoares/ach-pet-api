# Exemplos de uso dos módulos e mappers

## Módulos

```ts
import { createPetsModule } from "../src/modules/pets/index.js";

const petsModule = createPetsModule();
const petsRepo = petsModule.petsRepo;
```

## Mappers

```ts
import { prismaPetToDomain, domainPetToDTO } from "../src/shared/mappers/pet-mapper.js";

const prismaPet = { id: "1", name: "Rex", species: "Dog", status: "AVAILABLE", shelterId: "shelter1", photos: [], createdAt: new Date() };
const domainPet = prismaPetToDomain(prismaPet);
const dto = domainPetToDTO(domainPet);
```

## Value Object

```ts
import { Email } from "../src/domain/entities/Email.js";

const email = new Email("ana@email.com");
console.log(email.toString());
```
