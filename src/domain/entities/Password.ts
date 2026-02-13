export class Password {
  constructor(private readonly value: string) {
    if (!Password.isValid(value)) {
      throw new Error("Senha inválida: mínimo 6 caracteres");
    }
  }

  static isValid(password: string) {
    return typeof password === "string" && password.length >= 6;
  }

  toString() {
    return this.value;
  }
}
