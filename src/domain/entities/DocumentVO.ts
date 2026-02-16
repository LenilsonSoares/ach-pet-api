import { AppError } from '../errors/AppError.js';
/**
 * Value Object para CPF, com validação oficial dos dígitos verificadores.
 */
export class CPF {
  constructor(private readonly value: string) {
    if (!CPF.isValid(value)) {
      throw new AppError(422, "CPF inválido", "INVALID_CPF");
    }
  }

  /**
   * Validação oficial de CPF (algoritmo dos dígitos verificadores)
   * Aceita apenas números (sem pontos/traços)
   */
  static isValid(cpf: string): boolean {
    if (!cpf || !/^\d{11}$/.test(cpf)) return false;
    // Elimina CPFs com todos dígitos iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
    let firstCheck = (sum * 10) % 11;
    if (firstCheck === 10) firstCheck = 0;
    if (firstCheck !== Number(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
    let secondCheck = (sum * 10) % 11;
    if (secondCheck === 10) secondCheck = 0;
    return secondCheck === Number(cpf[10]);
  }

  toString() {
    return this.value;
  }
}

/**
 * Value Object para CNPJ, com validação oficial dos dígitos verificadores.
 */
export class CNPJ {
  constructor(private readonly value: string) {
    if (!CNPJ.isValid(value)) {
      throw new AppError(422, "CNPJ inválido", "INVALID_CNPJ");
    }
  }

  /**
   * Validação oficial de CNPJ (algoritmo dos dígitos verificadores)
   * Aceita apenas números (sem pontos/traços)
   */
  static isValid(cnpj: string): boolean {
    if (!cnpj || !/^\d{14}$/.test(cnpj)) return false;
    // Elimina CNPJs com todos dígitos iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    const calc = (len: number) => {
      let sum = 0;
      let pos = len - 7;
      for (let i = 0; i < len; i++) {
        sum += Number(cnpj[i]) * pos--;
        if (pos < 2) pos = 9;
      }
      let check = sum % 11;
      return check < 2 ? 0 : 11 - check;
    };
    const firstCheck = calc(12);
    if (firstCheck !== Number(cnpj[12])) return false;
    const secondCheck = calc(13);
    return secondCheck === Number(cnpj[13]);
  }

  toString() {
    return this.value;
  }
}

/**
 * Value Object para endereço, utilizado em entidades que exigem localização.
 */
export class Address {
  constructor(
    public readonly street: string,
    public readonly number: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zip: string,
  ) {}

  toString() {
    return `${this.street}, ${this.number} - ${this.city}/${this.state} (${this.zip})`;
  }
}
