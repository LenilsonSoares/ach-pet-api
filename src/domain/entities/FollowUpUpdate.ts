/**
 * Representa uma atualização de acompanhamento pós-adoção.
 * Pode conter texto, foto ou ambos.
 */
export class FollowUpUpdate {
  constructor(
    public readonly id: string,
    public readonly adoptionId: string,
    public text: string | null,
    public photoUrl: string | null,
    public readonly createdAt: Date,
    public readonly author: { id: string; name: string; role: "ADOPTER" | "SHELTER" },
  ) {}

  /**
   * Retorna true se a atualização possui foto.
   */
  hasPhoto() {
    return !!this.photoUrl;
  }

  /**
   * Retorna true se a atualização possui texto não vazio.
   */
  hasText() {
    return !!this.text && this.text.trim().length > 0;
  }
}
