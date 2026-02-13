export class Email {
  constructor(private readonly value: string) {
    if (!Email.isValid(value)) {
      throw new Error("Email inválido");
    }
  }

  static isValid(email: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  toString() {
    return this.value;
  }
}
