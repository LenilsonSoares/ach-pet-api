export type ChatMessage = {
  id: string;
  threadId: string;
  content: string;
  createdAt: Date;
  sender: { id: string; name: string; role: "ADOPTER" | "SHELTER" };
};

export type ThreadParticipants = {
  adopterId: string;
  shelterId: string;
};

export type ChatRepository = {
  getThreadParticipants(threadId: string): Promise<ThreadParticipants | null>;
  listMessages(threadId: string): Promise<ChatMessage[]>;
  createMessage(input: { threadId: string; senderId: string; content: string }): Promise<ChatMessage>;
};
