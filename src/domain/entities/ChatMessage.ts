/**
 * Entidade de mensagem de chat entre adotante e abrigo.
 */
export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly threadId: string,
    public content: string,
    public readonly createdAt: Date,
    public readonly sender: { id: string; name: string; role: "ADOPTER" | "SHELTER" },
  ) {}

  /**
   * Verifica se a mensagem foi enviada por um adotante.
   */
  isFromAdopter() {
    return this.sender.role === "ADOPTER";
  }

  /**
   * Verifica se a mensagem foi enviada por um abrigo.
   */
  isFromShelter() {
    return this.sender.role === "SHELTER";
  }
}
