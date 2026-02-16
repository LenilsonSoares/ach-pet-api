import { Email } from './Email.js';
import { Phone } from './Phone.js';
/**
 * Representa um usuário do sistema, podendo ser adotante ou abrigo.
 * Responsável por armazenar dados essenciais e regras de negócio relacionadas ao perfil.
 */
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: Email,
    public role: "ADOPTER" | "SHELTER",
    public passwordHash: string,
    public phone?: Phone,
    public orgName?: string,
    public createdAt?: Date,
  ) {}

  /**
   * Verifica se o usuário possui perfil de adotante.
   */
  isAdopter() {
    return this.role === "ADOPTER";
  }

  /**
   * Verifica se o usuário possui perfil de abrigo.
   */
  isShelter() {
    return this.role === "SHELTER";
  }

  /**
   * Atualiza o nome do usuário.
   */
  updateName(newName: string) {
    this.name = newName;
  }

  /**
   * Retorna o e-mail do usuário como string.
   */
  getEmail(): string {
    return this.email.toString();
  }

  /**
   * Retorna o telefone do usuário como string (ou undefined).
   */
  getPhone(): string | undefined {
    return this.phone?.toString();
  }
}
