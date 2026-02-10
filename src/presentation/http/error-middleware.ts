import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../../domain/errors/AppError.js";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Dados inválidos", issues: err.issues });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }

  if (typeof err === "object" && err && "name" in err && (err as any).name === "PrismaClientInitializationError") {
    return res.status(503).json({ error: "Banco de dados indisponível" });
  }

  console.error(err);
  return res.status(500).json({ error: "Erro interno" });
}
