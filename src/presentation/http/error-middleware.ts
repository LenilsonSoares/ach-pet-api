import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../../domain/errors/AppError.js";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos",
        code: "VALIDATION_ERROR",
        issues: err.issues,
      },
    });
  }

  if (typeof err === "object" && err && "name" in err && (err as any).name === "MulterError") {
    const code = (err as any).code as string | undefined;
    if (code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: { message: "Arquivo muito grande", code: "UPLOAD_FILE_TOO_LARGE" },
      });
    }
    return res.status(400).json({
      error: {
        message: "Erro no upload",
        code: code ? `UPLOAD_${code}` : "UPLOAD_ERROR",
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code ?? "APP_ERROR",
      },
    });
  }

  if (typeof err === "object" && err && "name" in err && (err as any).name === "PrismaClientInitializationError") {
    return res.status(503).json({
      error: { message: "Banco de dados indisponível", code: "DB_UNAVAILABLE" },
    });
  }

  console.error(err);
  return res.status(500).json({
    error: { message: "Erro interno", code: "INTERNAL_ERROR" },
  });
}
