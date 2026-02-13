import path from "node:path";
import { z } from "zod";
// Arquivo movido para infra/config/env.ts
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("7d"),
  UPLOADS_DIR: z
    .string()
    .min(1)
    .default("uploads")
    .refine(
      (value) => {
        if (path.isAbsolute(value)) return false;
        const segments = value.split(/[\\/]+/).filter(Boolean);
        return !segments.includes("..");
      },
      { message: "UPLOADS_DIR deve ser um caminho relativo sem '..'" },
    ),
});

export const env = envSchema.parse(process.env);
