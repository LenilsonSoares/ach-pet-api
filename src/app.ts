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

import { createAuthRouter } from "./presentation/http/routers/auth-router.js";
import { createPetsRouter } from "./presentation/http/routers/pets-router.js";
import { createAdoptionsRouter } from "./presentation/http/routers/adoptions-router.js";
import { createChatRouter } from "./presentation/http/routers/chat-router.js";
import { createFollowupRouter } from "./presentation/http/routers/followup-router.js";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./presentation/http/openapi.js";

/**
 * App Express (camada de Presentation / HTTP).
 *
 * Responsabilidades:
 * - configurar middlewares globais (segurança, rate limit, JSON)
 * - expor uploads locais em `/uploads` (MVP)
 * - publicar OpenAPI/Swagger
 * - compor dependências (infra) e conectar nas rotas (routers)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Upload local (MVP): salva arquivos em disco e publica via `/uploads/*`.
const uploadsDir = path.resolve(__dirname, "..", env.UPLOADS_DIR);
fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({
  dest: uploadsDir,
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

app.get("/", (_req, res) =>
  res.json({
    ok: true,
    name: "Ach Pet API",
    health: "/health",
    docs: "/docs",
    openapi: "/openapi.json",
  }),
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/openapi.json", (_req, res) => res.json(openapiSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));


// Composition Root (Clean Architecture): instancia as implementações de infra via módulos
const authModule = createAuthModule();
const petsModule = createPetsModule();
const adoptionsModule = createAdoptionsModule();
const chatModule = createChatModule();
const followupModule = createFollowupModule();

const auth = buildAuthMiddlewares(authModule.tokenService);

// Routers HTTP: adaptam request/response e chamam os use cases.
app.use("/auth", createAuthRouter(authModule));
app.use("/pets", createPetsRouter({
  petsRepo: petsModule.petsRepo,
  storageProvider: petsModule.storageProvider,
  upload,
  auth
}));
app.use("/adoptions", createAdoptionsRouter({ ...adoptionsModule, auth }));
app.use("/chat", createChatRouter({ ...chatModule, auth }));
app.use("/followup", createFollowupRouter({ ...followupModule, auth }));

app.use(errorMiddleware);
