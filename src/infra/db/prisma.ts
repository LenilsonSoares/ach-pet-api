import { PrismaClient } from "@prisma/client";
import { logger } from "../observability/logger.js";

export const prisma = new PrismaClient({
	log: ["query", "info", "warn", "error"],
});

prisma.$on("error", (e) => {
	logger.error({ err: e }, "Erro de integração com o banco de dados (Prisma)");
});
