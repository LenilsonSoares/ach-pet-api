import { describe, expect, it, vi } from 'vitest';
import { changePassword } from '../../../../application/use-cases/auth/changePassword.js';

const user = {
  id: 'user-1',
  role: 'ADOPTER' as const,
  name: 'Ana',
  email: 'ana@email.com',
  phone: null,
  passwordHash: 'old-hash',
};

const validRequest = {
  userId: 'user-1',
  currentPassword: '123456',
  newPassword: 'abcdef',
  confirmPassword: 'abcdef',
};

describe('changePassword (unit)', () => {
  it('deve alterar senha com sucesso', async () => {
    const deps = {
      authRepo: {
        findAuthById: vi.fn().mockResolvedValue(user),
        updatePasswordHash: vi.fn().mockResolvedValue(undefined),
      },
      passwordHasher: {
        compare: vi.fn()
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false),
        hash: vi.fn().mockResolvedValue('new-hash'),
      },
    };
    const handler = await changePassword(deps as any);

    await expect(handler(validRequest)).resolves.toEqual({ ok: true });

    expect(deps.passwordHasher.compare).toHaveBeenNthCalledWith(1, '123456', 'old-hash');
    expect(deps.passwordHasher.compare).toHaveBeenNthCalledWith(2, 'abcdef', 'old-hash');
    expect(deps.passwordHasher.hash).toHaveBeenCalledWith('abcdef');
    expect(deps.authRepo.updatePasswordHash).toHaveBeenCalledWith('user-1', 'new-hash');
  });

  it('deve rejeitar senha atual errada', async () => {
    const deps = {
      authRepo: {
        findAuthById: vi.fn().mockResolvedValue(user),
        updatePasswordHash: vi.fn(),
      },
      passwordHasher: {
        compare: vi.fn().mockResolvedValueOnce(false),
        hash: vi.fn(),
      },
    };
    const handler = await changePassword(deps as any);

    await expect(handler(validRequest)).rejects.toThrow(/senha atual/i);
    expect(deps.authRepo.updatePasswordHash).not.toHaveBeenCalled();
    expect(deps.passwordHasher.hash).not.toHaveBeenCalled();
  });

  it('deve rejeitar nova senha curta', async () => {
    const deps = {
      authRepo: {
        findAuthById: vi.fn(),
        updatePasswordHash: vi.fn(),
      },
      passwordHasher: {
        compare: vi.fn(),
        hash: vi.fn(),
      },
    };
    const handler = await changePassword(deps as any);

    await expect(handler({
      ...validRequest,
      newPassword: '123',
      confirmPassword: '123',
    })).rejects.toThrow(/minimo 6/i);
    expect(deps.authRepo.findAuthById).not.toHaveBeenCalled();
  });

  it('deve rejeitar confirmacao diferente', async () => {
    const deps = {
      authRepo: {
        findAuthById: vi.fn(),
        updatePasswordHash: vi.fn(),
      },
      passwordHasher: {
        compare: vi.fn(),
        hash: vi.fn(),
      },
    };
    const handler = await changePassword(deps as any);

    await expect(handler({
      ...validRequest,
      confirmPassword: 'diferente',
    })).rejects.toThrow(/confirmacao/i);
    expect(deps.authRepo.findAuthById).not.toHaveBeenCalled();
  });
});
