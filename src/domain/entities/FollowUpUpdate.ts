export class FollowUpUpdate {
  constructor(
    public readonly id: string,
    public readonly adoptionId: string,
    public text: string | null,
    public photoUrl: string | null,
    public readonly createdAt: Date,
    public readonly author: { id: string; name: string; role: "ADOPTER" | "SHELTER" },
  ) {}

  hasPhoto() {
    return !!this.photoUrl;
  }

  hasText() {
    return !!this.text && this.text.trim().length > 0;
  }
}
