import { loginUser } from '../../../../application/use-cases/auth/loginUser';
import { describe, it, expect, vi } from 'vitest';

describe('loginUser (unit)', () => {
  it('deve lançar erro se email não existir', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn().mockResolvedValue(null) },
      passwordHasher: { compare: vi.fn() },
      tokenService: { signAccessToken: vi.fn() },
    };
    const login = await loginUser(deps as any);
    await expect(
      login({ email: 'naoexiste@email.com', password: '123456' })
    ).rejects.toThrow();
  });

  it('deve lançar erro se senha estiver errada', async () => {
    const deps = {
      authRepo: { findByEmail: vi.fn().mockResolvedValue({ id: '1', email: 'a@a.com', passwordHash: 'hash', role: 'ADOPTER', name: 'A' }) },
      passwordHasher: { compare: vi.fn().mockResolvedValue(false) },
      tokenService: { signAccessToken: vi.fn() },
    };
    const login = await loginUser(deps as any);
    await expect(
      login({ email: 'a@a.com', password: 'errada' })
    ).rejects.toThrow();
  });
});
