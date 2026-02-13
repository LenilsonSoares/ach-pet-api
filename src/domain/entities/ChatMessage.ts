export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly threadId: string,
    public content: string,
    public readonly createdAt: Date,
    public readonly sender: { id: string; name: string; role: "ADOPTER" | "SHELTER" },
  ) {}

  isFromAdopter() {
    return this.sender.role === "ADOPTER";
  }

  isFromShelter() {
    return this.sender.role === "SHELTER";
  }
}
