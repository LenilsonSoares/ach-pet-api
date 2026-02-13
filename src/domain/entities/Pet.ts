export class Pet {
  constructor(
    public readonly id: string,
    public name: string,
    public species: string,
    public breed: string | null,
    public sex: string | null,
    public ageMonths: number | null,
    public size: string | null,
    public description: string | null,
    public status: "AVAILABLE" | "ADOPTED" | "PAUSED",
    public shelterId: string,
    public photos: { id: string; url: string }[] = [],
    public createdAt: Date,
  ) {}

  isAvailable() {
    return this.status === "AVAILABLE";
  }

  adopt() {
    if (!this.isAvailable()) {
      throw new Error("Pet não está disponível para adoção.");
    }
    this.status = "ADOPTED";
  }

  pause() {
    this.status = "PAUSED";
  }

  updateDescription(desc: string) {
    this.description = desc;
  }
}
