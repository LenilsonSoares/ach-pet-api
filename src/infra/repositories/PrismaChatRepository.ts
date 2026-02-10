import type { ChatMessage, ChatRepository, ThreadParticipants } from "../../application/ports/ChatRepository.js";
import { prisma } from "../db/prisma.js";

export class PrismaChatRepository implements ChatRepository {
  async getThreadParticipants(threadId: string): Promise<ThreadParticipants | null> {
    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      select: {
        adoption: { select: { adoptionRequest: { select: { adopterId: true, shelterId: true } } } },
      },
    });

    if (!thread) return null;
    return thread.adoption.adoptionRequest;
  }

  async listMessages(threadId: string): Promise<ChatMessage[]> {
    return prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      take: 200,
      include: { sender: { select: { id: true, name: true, role: true } } },
    });
  }

  async createMessage(input: { threadId: string; senderId: string; content: string }): Promise<ChatMessage> {
    return prisma.message.create({
      data: { threadId: input.threadId, senderId: input.senderId, content: input.content },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });
  }
}
