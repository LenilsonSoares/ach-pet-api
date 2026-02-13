/**
 * Validação e normalização de variáveis de ambiente.
 *
 * A ideia aqui é falhar rápido no boot se algum valor obrigatório estiver ausente,
 * e restringir caminhos de upload para evitar path traversal em ambientes locais.
 */
// ...existing code...
import { z } from "zod";
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  UPLOADS_DIR: z.string().default("uploads"),
});

export const env = envSchema.parse(process.env);