import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { env } from "./infra/env.js";
import { AppError } from "./domain/errors/AppError.js";
import { errorMiddleware } from "./presentation/http/error-middleware.js";
import { buildAuthMiddlewares } from "./presentation/http/auth-middleware.js";

import { PrismaAuthRepository } from "./infra/repositories/PrismaAuthRepository.js";
import { PrismaPetsRepository } from "./infra/repositories/PrismaPetsRepository.js";
import { PrismaAdoptionsRepository } from "./infra/repositories/PrismaAdoptionsRepository.js";
import { PrismaChatRepository } from "./infra/repositories/PrismaChatRepository.js";
import { PrismaFollowupRepository } from "./infra/repositories/PrismaFollowupRepository.js";
import { BcryptPasswordHasher } from "./infra/security/BcryptPasswordHasher.js";
import { JwtTokenService } from "./infra/security/JwtTokenService.js";

import { createAuthRouter } from "./presentation/http/routers/auth-router.js";
import { createPetsRouter } from "./presentation/http/routers/pets-router.js";
import { createAdoptionsRouter } from "./presentation/http/routers/adoptions-router.js";
import { createChatRouter } from "./presentation/http/routers/chat-router.js";
import { createFollowupRouter } from "./presentation/http/routers/followup-router.js";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./presentation/http/openapi.js";

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

// Uploads local (MVP)
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

// Composition Root (Clean Architecture): infra implementations
const authRepo = new PrismaAuthRepository();
const petsRepo = new PrismaPetsRepository();
const adoptionsRepo = new PrismaAdoptionsRepository();
const chatRepo = new PrismaChatRepository();
const followupRepo = new PrismaFollowupRepository();

const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const auth = buildAuthMiddlewares(tokenService);

// Presentation routers
app.use("/auth", createAuthRouter({ authRepo, passwordHasher, tokenService }));
app.use("/pets", createPetsRouter({ petsRepo, upload, auth }));
app.use("/adoptions", createAdoptionsRouter({ adoptionsRepo, auth }));
app.use("/chat", createChatRouter({ chatRepo, auth }));
app.use("/followup", createFollowupRouter({ followupRepo, auth }));

app.use(errorMiddleware);
