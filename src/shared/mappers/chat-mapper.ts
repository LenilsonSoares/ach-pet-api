import { ChatMessage } from "../../domain/entities/ChatMessage.js";

export function prismaChatMessageToDomain(msg: any): ChatMessage {
  return new ChatMessage(
    msg.id,
    msg.threadId,
    msg.content,
    msg.createdAt,
    msg.sender,
  );
}

export function domainChatMessageToDTO(msg: ChatMessage) {
  return {
    id: msg.id,
    threadId: msg.threadId,
    content: msg.content,
    createdAt: msg.createdAt,
    sender: msg.sender,
  };
}
