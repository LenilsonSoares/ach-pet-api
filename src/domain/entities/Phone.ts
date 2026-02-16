import { AppError } from '../errors/AppError.js';
/**
 * Value Object para telefone, aceitando formatos nacionais e internacionais.
 */
export class Phone {
  constructor(private readonly value: string) {
    if (!Phone.isValid(value)) {
      throw new AppError(422, "Telefone inválido", "INVALID_PHONE");
    }
  }

  /**
   * Valida formato do telefone (mínimo 10, máximo 15 dígitos, pode ter +).
   */
  static isValid(phone: string) {
    return /^\+?\d{10,15}$/.test(phone);
  }

  toString() {
    return this.value;
  }
}
