import { AppError } from '../errors/AppError.js';
/**
 * Entidade que representa um animal disponível para adoção.
 * Contém dados cadastrais, status e regras de negócio para adoção.
 */
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

  /**
   * Retorna true se o pet está disponível para adoção.
   */
  isAvailable() {
    return this.status === "AVAILABLE";
  }

  /**
   * Marca o pet como adotado, se disponível.
   * Lança erro caso não esteja disponível.
   */
  adopt() {
    if (!this.isAvailable()) {
      throw new AppError(400, "Pet não está disponível para adoção.", "PET_NOT_AVAILABLE");
    }
    this.status = "ADOPTED";
  }

  /**
   * Pausa a disponibilidade do pet para adoção.
   */
  pause() {
    this.status = "PAUSED";
  }

  /**
   * Atualiza a descrição do pet.
   */
  updateDescription(desc: string) {
    this.description = desc;
  }
}
