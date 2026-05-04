import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { env } from "./infra/config/env.js";
import { AppError } from "./domain/errors/AppError.js";
import { errorMiddleware } from "./presentation/http/error-middleware.js";
import { buildAuthMiddlewares } from "./presentation/http/auth-middleware.js";

import { createAuthModule } from "./modules/auth/index.js";
import { createPetsModule } from "./modules/pets/index.js";
import { createAdoptionsModule } from "./modules/adoptions/index.js";
import { createChatModule } from "./modules/chat/index.js";
import { createFollowupModule } from "./modules/followup/index.js";

import {
  metricsMiddleware,
  metricsEndpoint,
} from "./infra/observability/metrics.js";

import { createAuthRouter } from "./presentation/http/routers/auth-router.js";
import { createPetsRouter } from "./presentation/http/routers/pets-router.js";
import { createAdoptionsRouter } from "./presentation/http/routers/adoptions-router.js";
import { createChatRouter } from "./presentation/http/routers/chat-router.js";
import { createFollowupRouter } from "./presentation/http/routers/followup-router.js";
import { accessLogMiddleware } from "./presentation/http/middlewares/access-log-middleware.js";

import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./presentation/http/openapi.js";

/**
 * App Express (camada de Presentation / HTTP).
 *
 * Responsabilidades:
 * - configurar middlewares globais de segurança, rate limit e JSON
 * - confiar no proxy da Square Cloud para evitar erro no express-rate-limit
 * - expor uploads locais em `/uploads`
 * - publicar OpenAPI/Swagger
 * - compor dependências e conectar rotas
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Necessário em ambientes com proxy/reverse proxy, como Square Cloud.
 *
 * Sem isso, o express-rate-limit pode gerar:
 * ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
 */
app.set("trust proxy", 1);

// Middleware global de logs de acesso HTTP
app.use(accessLogMiddleware);

// Observabilidade: métricas Prometheus
app.use(metricsMiddleware);

// Segurança e parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Rate limit global
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Upload local: salva arquivos em disco e publica via `/uploads/*`
const uploadsDir = path.resolve(__dirname, "..", env.UPLOADS_DIR);

fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new AppError(400, "Apenas imagens são permitidas"));
    }

    return cb(null, true);
  },
});

app.use("/uploads", express.static(uploadsDir));

// Rotas públicas base
app.get("/", (_req: express.Request, res: express.Response) =>
  res.json({
    ok: true,
    name: "Ach Pet API",
    health: "/health",
    docs: "/docs",
    openapi: "/openapi.json",
  }),
);

app.get("/health", (_req: express.Request, res: express.Response) =>
  res.json({ ok: true }),
);

// Endpoint Prometheus
app.get("/metrics", metricsEndpoint);

// OpenAPI / Swagger
app.get("/openapi.json", (_req: express.Request, res: express.Response) =>
  res.json(openapiSpec),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Composition Root
const authModule = createAuthModule();
const petsModule = createPetsModule();
const adoptionsModule = createAdoptionsModule();
const chatModule = createChatModule();
const followupModule = createFollowupModule();

const auth = buildAuthMiddlewares(authModule.tokenService);

// Routers HTTP
app.use("/auth", createAuthRouter(authModule));

app.use(
  "/pets",
  createPetsRouter({
    petsRepo: petsModule.petsRepo,
    storageProvider: petsModule.storageProvider,
    upload,
    auth,
  }),
);

app.use("/adoptions", createAdoptionsRouter({ ...adoptionsModule, auth }));
app.use("/chat", createChatRouter({ ...chatModule, auth }));
app.use("/followup", createFollowupRouter({ ...followupModule, auth }));

// Middleware central de erros
app.use(errorMiddleware);

export { app };