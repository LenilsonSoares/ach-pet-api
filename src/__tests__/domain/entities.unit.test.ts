import { describe, it, expect } from 'vitest';
import { User } from '../../domain/entities/User.js';
import { Pet } from '../../domain/entities/Pet.js';
import { Email } from '../../domain/entities/Email.js';
import { Password } from '../../domain/entities/Password.js';
import { Phone } from '../../domain/entities/Phone.js';
import { CPF, CNPJ } from '../../domain/entities/DocumentVO.js';

// Testes para User

describe('User', () => {
  it('deve identificar perfil adotante e abrigo', () => {
    const u1 = new User('1', 'Ana', new Email('ana@email.com'), 'ADOPTER', 'hash', new Phone('11999999999'));
    const u2 = new User('2', 'Abrigo', new Email('abrigo@email.com'), 'SHELTER', 'hash', new Phone('11988888888'));
    expect(u1.isAdopter()).toBe(true);
    expect(u1.isShelter()).toBe(false);
    expect(u2.isAdopter()).toBe(false);
    expect(u2.isShelter()).toBe(true);
    expect(u1.getEmail()).toBe('ana@email.com');
    expect(u2.getPhone()).toBe('11988888888');
  });
  it('atualiza nome', () => {
    const u = new User('1', 'Ana', new Email('ana@email.com'), 'ADOPTER', 'hash', new Phone('11999999999'));
    u.updateName('Maria');
    expect(u.name).toBe('Maria');
  });
});

describe('Pet', () => {
  it('deve adotar pet disponível', () => {
    const pet = new Pet('1', 'Rex', 'dog', null, null, null, null, null, 'AVAILABLE', 's1', [], new Date());
    pet.adopt();
    expect(pet.status).toBe('ADOPTED');
  });
  it('não permite adotar pet já adotado', () => {
    const pet = new Pet('1', 'Rex', 'dog', null, null, null, null, null, 'ADOPTED', 's1', [], new Date());
    expect(() => pet.adopt()).toThrow();
  });
  it('pausa pet', () => {
    const pet = new Pet('1', 'Rex', 'dog', null, null, null, null, null, 'AVAILABLE', 's1', [], new Date());
    pet.pause();
    expect(pet.status).toBe('PAUSED');
  });
});

describe('Email', () => {
  it('aceita e-mails válidos', () => {
    expect(() => new Email('a@b.com')).not.toThrow();
  });
  it('rejeita e-mails inválidos', () => {
    expect(() => new Email('abc')).toThrow();
  });
});

describe('Password', () => {
  it('aceita senha >= 6 caracteres', () => {
    expect(() => new Password('123456')).not.toThrow();
  });
  it('rejeita senha curta', () => {
    expect(() => new Password('123')).toThrow();
  });
});

describe('Phone', () => {
  it('aceita telefones válidos', () => {
    expect(() => new Phone('+5511999999999')).not.toThrow();
    expect(() => new Phone('11999999999')).not.toThrow();
  });
  it('rejeita telefones inválidos', () => {
    expect(() => new Phone('123')).toThrow();
  });
});

describe('CPF', () => {
  it('aceita CPF válido', () => {
    expect(() => new CPF('52998224725')).not.toThrow();
  });
  it('rejeita CPF inválido', () => {
    expect(() => new CPF('12345678900')).toThrow();
    expect(() => new CPF('11111111111')).toThrow();
  });
});

describe('CNPJ', () => {
  it('aceita CNPJ válido', () => {
    expect(() => new CNPJ('19131243000197')).not.toThrow();
  });
  it('rejeita CNPJ inválido', () => {
    expect(() => new CNPJ('12345678000100')).toThrow();
    expect(() => new CNPJ('11111111111111')).toThrow();
  });
});
