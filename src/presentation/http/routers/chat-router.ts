import { Router } from "express";
import { z } from "zod";

import type { ChatRepository } from "../../../application/ports/ChatRepository.js";
import type { AuthenticatedRequest } from "../auth-middleware.js";

import { listMessages } from "../../../application/use-cases/chat/listMessages.js";
import { sendMessage } from "../../../application/use-cases/chat/sendMessage.js";

export function createChatRouter(deps: {
  chatRepo: ChatRepository;
  auth: { requireAuth: (req: AuthenticatedRequest, res: any, next: any) => void };
}) {
  const router = Router();

  router.get("/threads/:threadId/messages", deps.auth.requireAuth, async (req: AuthenticatedRequest, res) => {
    const handler = listMessages({ chatRepo: deps.chatRepo });
    const result = await handler({ threadId: req.params.threadId, userId: req.user!.id });
    return res.json(result);
  });

  const sendSchema = z.object({ content: z.string().min(1).max(2000) });

  router.post("/threads/:threadId/messages", deps.auth.requireAuth, async (req: AuthenticatedRequest, res) => {
    const body = sendSchema.parse(req.body);
    const handler = sendMessage({ chatRepo: deps.chatRepo });
    const result = await handler({ threadId: req.params.threadId, userId: req.user!.id, content: body.content });
    return res.status(201).json(result);
  });

  return router;
}
