import { describe, expect, it } from 'vitest';
import { normalizeUpdateProfileInput } from '../../../../application/use-cases/auth/profileValidation.js';

describe('profileValidation (unit)', () => {
  it('deve normalizar CPF, telefone e endereco na edicao de adotante', () => {
    const result = normalizeUpdateProfileInput('ADOPTER', {
      phone: '(77) 98888-7777',
      cpf: '529.982.247-25',
      birthDate: '10/05/1990',
      address: 'Rua Atualizada, 100',
      cnpj: '19.131.243/0001-97',
    });

    expect(result).toEqual({
      name: undefined,
      email: undefined,
      phone: '77988887777',
      cpf: '52998224725',
      birthDate: '10/05/1990',
      address: 'Rua Atualizada, 100',
    });
  });

  it('deve rejeitar CPF invalido na edicao de adotante', () => {
    expect(() => normalizeUpdateProfileInput('ADOPTER', { cpf: '111.111.111-11' })).toThrow(/CPF/i);
    expect(() => normalizeUpdateProfileInput('ADOPTER', { cpf: 'abc' })).toThrow(/CPF/i);
  });

  it('deve normalizar CNPJ na edicao de abrigo', () => {
    const result = normalizeUpdateProfileInput('SHELTER', {
      orgName: 'Abrigo Feliz',
      cnpj: '19.131.243/0001-97',
      address: 'Rua do Abrigo, 200',
    });

    expect(result).toEqual({
      name: undefined,
      email: undefined,
      phone: undefined,
      orgName: 'Abrigo Feliz',
      cnpj: '19131243000197',
      responsible: undefined,
      address: 'Rua do Abrigo, 200',
      site: undefined,
    });
  });

  it('deve rejeitar endereco muito curto na edicao de perfil', () => {
    expect(() => normalizeUpdateProfileInput('SHELTER', { address: 'Rua 1' })).toThrow(/Endereco/i);
  });
});
