import { describe, it, expect, vi } from 'vitest';
import { registerUser } from '../../../../application/use-cases/auth/registerUser.js';

const validAdopterRequest = {
  name: 'Ana',
  email: 'ana@email.com',
  password: '123456',
  role: 'ADOPTER' as const,
  phone: '(77) 99999-9999',
  cpf: '529.982.247-25',
  birthDate: '10/05/1990',
  address: 'Rua A, 123',
};

function formatPtBrDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

describe('registerUser (unit)', () => {
  it('deve lancar erro se email ja existir', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn().mockResolvedValue({ id: '1' }) },
      passwordHasher: { hash: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const register = await registerUser(deps as any);

    await expect(register(validAdopterRequest)).rejects.toThrow();
  });

  it('deve criar usuario se email for novo e normalizar telefone/CPF', async () => {
    const deps = {
      authRepo: {
        findByEmail: vi.fn().mockResolvedValue(null),
        createUser: vi.fn().mockResolvedValue({ id: '1', name: 'Ana', email: 'ana@email.com', role: 'ADOPTER' }),
      },
      passwordHasher: { hash: vi.fn().mockResolvedValue('hash') },
      tokenService: { signAccessToken: vi.fn().mockReturnValue('token') },
    };
    const register = await registerUser(deps as any);

    const result = await register(validAdopterRequest);

    expect(result.user.name).toBe('Ana');
    expect(result.token).toBe('token');
    expect(deps.authRepo.createUser).toHaveBeenCalledWith(expect.objectContaining({
      phone: '77999999999',
      cpf: '52998224725',
      birthDate: '10/05/1990',
      address: 'Rua A, 123',
    }));
  });

  it('deve rejeitar CPF invalido no cadastro de adotante', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn(), createUser: vi.fn() },
      passwordHasher: { hash: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const register = await registerUser(deps as any);

    await expect(register({ ...validAdopterRequest, cpf: '123.456.789-00' })).rejects.toThrow(/CPF/i);
    expect(deps.authRepo.findByEmail).not.toHaveBeenCalled();
    expect(deps.authRepo.createUser).not.toHaveBeenCalled();
  });

  it('deve rejeitar data de nascimento invalida', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn(), createUser: vi.fn() },
      passwordHasher: { hash: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const register = await registerUser(deps as any);

    await expect(register({ ...validAdopterRequest, birthDate: '31/02/1990' })).rejects.toThrow(/data/i);
  });

  it('deve rejeitar data de nascimento futura', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn(), createUser: vi.fn() },
      passwordHasher: { hash: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const register = await registerUser(deps as any);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await expect(register({ ...validAdopterRequest, birthDate: formatPtBrDate(tomorrow) })).rejects.toThrow(/futura/i);
  });

  it('deve rejeitar adotante menor de idade', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn(), createUser: vi.fn() },
      passwordHasher: { hash: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const register = await registerUser(deps as any);
    const underageYear = new Date().getFullYear() - 10;

    await expect(register({ ...validAdopterRequest, birthDate: `01/01/${underageYear}` })).rejects.toThrow(/18/);
  });

  it('deve rejeitar CNPJ invalido no cadastro de abrigo', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn(), createUser: vi.fn() },
      passwordHasher: { hash: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const register = await registerUser(deps as any);

    await expect(register({
      name: 'Abrigo',
      email: 'abrigo@email.com',
      password: '123456',
      role: 'SHELTER',
      orgName: 'Abrigo Feliz',
      cnpj: '12.345.678/0001-00',
      address: 'Rua B, 456',
    })).rejects.toThrow(/CNPJ/i);
  });

  it('deve criar abrigo valido com CNPJ normalizado', async () => {
    const deps = {
      authRepo: {
        findByEmail: vi.fn().mockResolvedValue(null),
        createUser: vi.fn().mockResolvedValue({ id: '1', name: 'Abrigo', email: 'abrigo@email.com', role: 'SHELTER' }),
      },
      passwordHasher: { hash: vi.fn().mockResolvedValue('hash') },
      tokenService: { signAccessToken: vi.fn().mockReturnValue('token') },
    };
    const register = await registerUser(deps as any);

    const result = await register({
      name: 'Abrigo',
      email: 'abrigo@email.com',
      password: '123456',
      role: 'SHELTER',
      orgName: 'Abrigo Feliz',
      cnpj: '19.131.243/0001-97',
      address: 'Rua B, 456',
    });

    expect(result.token).toBe('token');
    expect(deps.authRepo.createUser).toHaveBeenCalledWith(expect.objectContaining({
      cnpj: '19131243000197',
      address: 'Rua B, 456',
      cpf: undefined,
      birthDate: undefined,
    }));
  });
});
