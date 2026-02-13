import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty" }
      : undefined,
});

// Exemplo de uso:
// logger.info({ userId, requestId }, "Usuário autenticado")
// logger.error({ err }, "Erro inesperado")
