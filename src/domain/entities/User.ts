export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public role: "ADOPTER" | "SHELTER",
    public passwordHash: string,
    public phone?: string,
    public orgName?: string,
    public createdAt?: Date,
  ) {}

  isAdopter() {
    return this.role === "ADOPTER";
  }

  isShelter() {
    return this.role === "SHELTER";
  }

  updateName(newName: string) {
    this.name = newName;
  }
}
