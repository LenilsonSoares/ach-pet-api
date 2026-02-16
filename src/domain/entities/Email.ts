import { AppError } from '../errors/AppError.js';
/**
 * Value Object para e-mail, com validação simples de formato.
 */
export class Email {
  constructor(private readonly value: string) {
    if (!Email.isValid(value)) {
      throw new AppError(422, "Email inválido", "INVALID_EMAIL");
    }
  }

  /**
   * Valida formato básico de e-mail.
   */
  static isValid(email: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  toString() {
    return this.value;
  }
}
