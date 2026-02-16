import { describe, it, expect, vi } from 'vitest';
import { registerUser } from '../../../../application/use-cases/auth/registerUser';

describe('registerUser (unit)', () => {
  it('deve lançar erro se email já existir', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn().mockResolvedValue({ id: '1' }) },
      passwordHasher: { hash: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const register = await registerUser(deps as any);
    await expect(
      register({ name: 'Ana', email: 'ana@email.com', password: '123456', role: 'ADOPTER' })
    ).rejects.toThrow();
  });

  it('deve criar usuário se email for novo', async () => {
    const deps = {
      authRepo: {
        findByEmail: vi.fn().mockResolvedValue(null),
        createUser: vi.fn().mockResolvedValue({ id: '1', name: 'Ana', email: 'ana@email.com', role: 'ADOPTER' })
      },
      passwordHasher: { hash: vi.fn().mockResolvedValue('hash') },
      tokenService: { signAccessToken: vi.fn().mockReturnValue('token') },
    };
    const register = await registerUser(deps as any);
    const result = await register({ name: 'Ana', email: 'ana@email.com', password: '123456', role: 'ADOPTER' });
    expect(result.user.name).toBe('Ana');
    expect(result.token).toBe('token');
  });
});
