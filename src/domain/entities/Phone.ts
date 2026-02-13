export class Phone {
  constructor(private readonly value: string) {
    if (!Phone.isValid(value)) {
      throw new Error("Telefone inválido");
    }
  }

  static isValid(phone: string) {
    return /^\+?\d{10,15}$/.test(phone);
  }

  toString() {
    return this.value;
  }
}
