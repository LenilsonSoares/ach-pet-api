/**
 * Entry point do servidor HTTP.
 *
 * Importa variáveis de ambiente antes de inicializar o app, garantindo que
 * `env` seja validado com `process.env` já carregado.
 */
import "dotenv/config";
import { env } from "./infra/config/env.js";
import { app } from "./app.js";

app.listen(env.PORT, () => {
  console.log(`[ach-pet-api] listening on :${env.PORT}`);
});
