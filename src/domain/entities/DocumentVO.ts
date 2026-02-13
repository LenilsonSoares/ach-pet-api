export class CPF {
  constructor(private readonly value: string) {
    if (!CPF.isValid(value)) {
      throw new Error("CPF inválido");
    }
  }

  static isValid(cpf: string) {
    return /^\d{11}$/.test(cpf);
  }

  toString() {
    return this.value;
  }
}

export class CNPJ {
  constructor(private readonly value: string) {
    if (!CNPJ.isValid(value)) {
      throw new Error("CNPJ inválido");
    }
  }

  static isValid(cnpj: string) {
    return /^\d{14}$/.test(cnpj);
  }

  toString() {
    return this.value;
  }
}

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
