import { Router } from "express";
import { z } from "zod";

import type { ChatRepository } from "../../../application/ports/ChatRepository.js";
import type { AuthenticatedRequest } from "../auth-middleware.js";
import { AppError } from "../../../domain/errors/AppError.js";

import { listMessages } from "../../../application/use-cases/chat/listMessages.js";
import { sendMessage } from "../../../application/use-cases/chat/sendMessage.js";
import { asyncHandler } from "../async-handler.js";

const TYPING_TTL_MS = 4_500;

type TypingEntry = {
  userId: string;
  role: "ADOPTER" | "SHELTER";
  expiresAt: number;
};

const typingByThread = new Map<string, Map<string, TypingEntry>>();

function pruneTyping(threadId: string) {
  const now = Date.now();
  const threadTyping = typingByThread.get(threadId);
  if (!threadTyping) return;

  for (const [userId, entry] of threadTyping.entries()) {
    if (entry.expiresAt <= now) threadTyping.delete(userId);
  }

  if (threadTyping.size === 0) typingByThread.delete(threadId);
}

async function assertThreadParticipant(chatRepo: ChatRepository, threadId: string, userId: string) {
  const participants = await chatRepo.getThreadParticipants(threadId);
  if (!participants) throw new AppError(404, "Thread não encontrada");

  if (userId !== participants.adopterId && userId !== participants.shelterId) {
    throw new AppError(403, "Sem permissão");
  }
}

/**
 * Rotas de chat.
 *
 * Mensagens são organizadas por thread. O acesso é protegido e a autorização
 * de participantes é feita no use case.
 */
export function createChatRouter(deps: {
  chatRepo: ChatRepository;
  auth: { requireAuth: (req: AuthenticatedRequest, res: any, next: any) => void };
}) {
  const router = Router();

  router.get(
    "/threads/:threadId/messages",
    deps.auth.requireAuth,
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = listMessages({ chatRepo: deps.chatRepo });
      const result = await handler({ threadId: req.params.threadId, userId: req.user!.id });
      return res.json(result);
    }),
  );

  const sendSchema = z.object({ content: z.string().min(1).max(2000) });

  router.post(
    "/threads/:threadId/messages",
    deps.auth.requireAuth,
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const body = sendSchema.parse(req.body);
      const handler = sendMessage({ chatRepo: deps.chatRepo });
      const result = await handler({ threadId: req.params.threadId, userId: req.user!.id, content: body.content });
      typingByThread.get(req.params.threadId)?.delete(req.user!.id);
      return res.status(201).json(result);
    }),
  );

  const typingSchema = z.object({ isTyping: z.boolean() });

  router.post(
    "/threads/:threadId/typing",
    deps.auth.requireAuth,
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const body = typingSchema.parse(req.body);
      const threadId = req.params.threadId;

      await assertThreadParticipant(deps.chatRepo, threadId, req.user!.id);
      pruneTyping(threadId);

      if (body.isTyping) {
        const threadTyping = typingByThread.get(threadId) ?? new Map<string, TypingEntry>();
        threadTyping.set(req.user!.id, {
          userId: req.user!.id,
          role: req.user!.role,
          expiresAt: Date.now() + TYPING_TTL_MS,
        });
        typingByThread.set(threadId, threadTyping);
      } else {
        typingByThread.get(threadId)?.delete(req.user!.id);
      }

      return res.json({ isTyping: body.isTyping });
    }),
  );

  router.get(
    "/threads/:threadId/typing",
    deps.auth.requireAuth,
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const threadId = req.params.threadId;

      await assertThreadParticipant(deps.chatRepo, threadId, req.user!.id);
      pruneTyping(threadId);

      const typingUsers = [...(typingByThread.get(threadId)?.values() ?? [])].filter(
        (entry) => entry.userId !== req.user!.id,
      );

      return res.json({
        isTyping: typingUsers.length > 0,
        users: typingUsers.map((entry) => ({ id: entry.userId, role: entry.role })),
      });
    }),
  );

  return router;
}
