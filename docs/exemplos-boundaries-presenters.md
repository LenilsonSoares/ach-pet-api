# Exemplos de boundaries e presenters

## Boundary e Presenter para criação de pet

```ts
import { CreatePetPresenter } from "../src/application/use-cases/pets/createPet.boundary.js";

class JsonCreatePetPresenter implements CreatePetPresenter {
  present(output) {
    return JSON.stringify(output);
  }
}
```

## Boundary e Presenter para envio de mensagem

```ts
import { SendMessagePresenter } from "../src/application/use-cases/chat/sendMessage.boundary.js";

class JsonSendMessagePresenter implements SendMessagePresenter {
  present(output) {
    return JSON.stringify(output);
  }
}
```
