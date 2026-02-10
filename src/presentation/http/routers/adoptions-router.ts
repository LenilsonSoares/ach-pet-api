import { Router } from "express";
import { z } from "zod";

import type { AdoptionsRepository } from "../../../application/ports/AdoptionsRepository.js";
import type { AuthenticatedRequest } from "../auth-middleware.js";

import { createAdoptionRequest } from "../../../application/use-cases/adoptions/createRequest.js";
import { listInbox } from "../../../application/use-cases/adoptions/listInbox.js";
import { listMine } from "../../../application/use-cases/adoptions/listMine.js";
import { approveRequest } from "../../../application/use-cases/adoptions/approveRequest.js";
import { rejectRequest } from "../../../application/use-cases/adoptions/rejectRequest.js";
import { interveneAdoption } from "../../../application/use-cases/adoptions/interveneAdoption.js";
import { asyncHandler } from "../async-handler.js";

/**
 * Rotas do fluxo de adoção.
 *
 * - ADOPTER cria solicitações e lista as próprias
 * - SHELTER lista inbox e aprova/rejeita
 * - SHELTER pode marcar intervenção em uma adoção ativa
 */
export function createAdoptionsRouter(deps: {
  adoptionsRepo: AdoptionsRepository;
  auth: {
    requireAuth: (req: AuthenticatedRequest, res: any, next: any) => void;
    requireRole: (role: "ADOPTER" | "SHELTER") => (req: AuthenticatedRequest, res: any, next: any) => void;
  };
}) {
  const router = Router();

  const createRequestSchema = z.object({
    petId: z.string().min(1),
    message: z.string().optional(),
  });

  router.post(
    "/requests",
    deps.auth.requireAuth,
    deps.auth.requireRole("ADOPTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const body = createRequestSchema.parse(req.body);
      const handler = createAdoptionRequest({ adoptionsRepo: deps.adoptionsRepo });
      const result = await handler({ adopterId: req.user!.id, petId: body.petId, message: body.message });
      return res.status(201).json(result);
    }),
  );

  router.get(
    "/requests/inbox",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = listInbox({ adoptionsRepo: deps.adoptionsRepo });
      const result = await handler(req.user!.id);
      return res.json(result);
    }),
  );

  router.get(
    "/requests/mine",
    deps.auth.requireAuth,
    deps.auth.requireRole("ADOPTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = listMine({ adoptionsRepo: deps.adoptionsRepo });
      const result = await handler(req.user!.id);
      return res.json(result);
    }),
  );

  const decideSchema = z.object({
    followUpDays: z.coerce.number().int().positive().optional(),
  });

  router.post(
    "/requests/:id/approve",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const body = decideSchema.parse(req.body);
      const handler = approveRequest({ adoptionsRepo: deps.adoptionsRepo });
      const result = await handler({
        shelterId: req.user!.id,
        requestId: req.params.id,
        followUpDays: body.followUpDays ?? 30,
      });
      return res.json(result);
    }),
  );

  router.post(
    "/requests/:id/reject",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = rejectRequest({ adoptionsRepo: deps.adoptionsRepo });
      const result = await handler({ shelterId: req.user!.id, requestId: req.params.id });
      return res.json(result);
    }),
  );

  router.post(
    "/:adoptionId/intervene",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = interveneAdoption({ adoptionsRepo: deps.adoptionsRepo });
      const result = await handler({ adoptionId: req.params.adoptionId, shelterId: req.user!.id });
      return res.json(result);
    }),
  );

  return router;
}
