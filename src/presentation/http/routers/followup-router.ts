import { Router } from "express";
import { z } from "zod";

import type { FollowupRepository } from "../../../application/ports/FollowupRepository.js";
import type { AuthenticatedRequest } from "../auth-middleware.js";

import { listUpdates } from "../../../application/use-cases/followup/listUpdates.js";
import { createUpdate } from "../../../application/use-cases/followup/createUpdate.js";
import { asyncHandler } from "../async-handler.js";

function isValidUrlOrUploads(value: string) {
  if (value.startsWith("/uploads/")) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function createFollowupRouter(deps: {
  followupRepo: FollowupRepository;
  auth: { requireAuth: (req: AuthenticatedRequest, res: any, next: any) => void };
}) {
  const router = Router();

  router.get(
    "/adoptions/:adoptionId/updates",
    deps.auth.requireAuth,
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = listUpdates({ followupRepo: deps.followupRepo });
      const result = await handler({ adoptionId: req.params.adoptionId, userId: req.user!.id });
      return res.json(result);
    }),
  );

  const createSchema = z.object({
    text: z.string().max(2000).optional(),
    photoUrl: z
      .string()
      .optional()
      .refine((value) => (value ? isValidUrlOrUploads(value) : true), {
        message: "photoUrl deve ser uma URL válida ou começar com /uploads/",
      }),
  });

  router.post(
    "/adoptions/:adoptionId/updates",
    deps.auth.requireAuth,
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const body = createSchema.parse(req.body);

      const handler = createUpdate({ followupRepo: deps.followupRepo });
      const result = await handler({
        adoptionId: req.params.adoptionId,
        userId: req.user!.id,
        text: body.text,
        photoUrl: body.photoUrl,
      });

      return res.status(201).json(result);
    }),
  );

  return router;
}
