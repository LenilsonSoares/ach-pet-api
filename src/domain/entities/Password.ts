import { AppError } from '../errors/AppError.js';
/**
 * Value Object para senha, garantindo mínimo de segurança.
 */
export class Password {
  constructor(private readonly value: string) {
    if (!Password.isValid(value)) {
      throw new AppError(422, "Senha inválida: mínimo 6 caracteres", "INVALID_PASSWORD");
    }
  }

  /**
   * Valida se a senha atende ao mínimo de 6 caracteres.
   */
  static isValid(password: string) {
    return typeof password === "string" && password.length >= 6;
  }

  toString() {
    return this.value;
  }
}
