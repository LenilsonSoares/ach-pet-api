import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../../domain/errors/AppError.js";

/**
 * Middleware central de erros.
 *
 * Padroniza o formato de resposta de erro e traduz exceções comuns (Zod, Multer,
 * erros do domínio e indisponibilidade do Prisma) para códigos HTTP apropriados.
 */
export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      code: "VALIDATION_ERROR",
      issues: err.issues,
    });
  }

  if (typeof err === "object" && err && "name" in err && (err as any).name === "MulterError") {
    const code = (err as any).code as string | undefined;
    if (code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Arquivo muito grande",
        code: "UPLOAD_FILE_TOO_LARGE",
      });
    }
    return res.status(400).json({
      message: "Erro no upload",
      code: code ? `UPLOAD_${code}` : "UPLOAD_ERROR",
    });
  }


  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code ?? "APP_ERROR",
    });
  }

  // Log detalhado para CI/debug
  // eslint-disable-next-line no-console
  console.error("[error-middleware] Erro não tratado:", err);
  if (err instanceof Error && err.stack) {
    // eslint-disable-next-line no-console
    console.error(err.stack);
  }

  if (typeof err === "object" && err && "name" in err && (err as any).name === "PrismaClientInitializationError") {
    return res.status(503).json({
      message: "Banco de dados indisponível",
      code: "DB_UNAVAILABLE",
    });
  }

  console.error(err);
  return res.status(500).json({
    message: "Erro interno",
    code: "INTERNAL_ERROR",
  });
}
