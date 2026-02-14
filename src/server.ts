/**
 * Entry point do servidor HTTP.
 *
 * Importa variáveis de ambiente antes de inicializar o app, garantindo que
 * `env` seja validado com `process.env` já carregado.
 */
import "dotenv/config";
import { env } from "./infra/config/env.js";
import { app } from "./app.js";
import { prisma } from "./infra/db/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(`[ach-pet-api] listening on :${env.PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("[ach-pet-api] Shutting down...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("[ach-pet-api] Server closed.");
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
