// @ts-ignore
import { logger } from "../../../infra/observability/logger.js";
import type { Request, Response, NextFunction } from "express";

export function accessLogMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      durationMs: Math.round(durationMs)
    }, "HTTP access");
  });
  next();
}
