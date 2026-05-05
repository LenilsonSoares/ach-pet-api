import { describe, expect, it, vi } from 'vitest';
import { requestPasswordReset } from '../../../../application/use-cases/auth/requestPasswordReset.js';
import { resetPassword } from '../../../../application/use-cases/auth/resetPassword.js';
import { hashPasswordResetToken } from '../../../../application/use-cases/auth/passwordResetToken.js';

const fixedNow = new Date('2026-05-05T12:00:00.000Z');
const genericMessage = /se o e-mail estiver cadastrado/i;

const user = {
  id: 'user-1',
  role: 'ADOPTER' as const,
  name: 'Ana',
  email: 'ana@email.com',
  passwordHash: 'old-hash',
};

describe('password reset (unit)', () => {
  it('deve responder sucesso generico quando email nao existe', async () => {
    const deps = {
      authRepo: {
        findByEmail: vi.fn().mockResolvedValue(null),
        createPasswordResetToken: vi.fn(),
      },
      now: () => fixedNow,
      generateToken: () => 'raw-token',
      exposeResetToken: true,
    };
    const handler = await requestPasswordReset(deps as any);

    const result = await handler({ email: 'naoexiste@email.com' });

    expect(result.message).toMatch(genericMessage);
    expect(result.resetToken).toBeUndefined();
    expect(deps.authRepo.createPasswordResetToken).not.toHaveBeenCalled();
  });

  it('deve criar token seguro usando hash e expiracao', async () => {
    const deps = {
      authRepo: {
        findByEmail: vi.fn().mockResolvedValue(user),
        createPasswordResetToken: vi.fn().mockResolvedValue(undefined),
      },
      now: () => fixedNow,
      generateToken: () => 'raw-token',
      exposeResetToken: true,
      expirationMinutes: 15,
    };
    const handler = await requestPasswordReset(deps as any);

    const result = await handler({ email: 'ANA@EMAIL.COM ' });

    expect(result).toEqual({
      message: expect.stringMatching(genericMessage),
      resetToken: 'raw-token',
      expiresAt: '2026-05-05T12:15:00.000Z',
    });
    expect(deps.authRepo.findByEmail).toHaveBeenCalledWith('ana@email.com');
    expect(deps.authRepo.createPasswordResetToken).toHaveBeenCalledWith({
      userId: 'user-1',
      tokenHash: hashPasswordResetToken('raw-token'),
      expiresAt: new Date('2026-05-05T12:15:00.000Z'),
    });
    expect(deps.authRepo.createPasswordResetToken.mock.calls[0][0].tokenHash).not.toBe('raw-token');
  });

  it('deve redefinir senha com token valido', async () => {
    const tokenHash = hashPasswordResetToken('valid-token');
    const deps = {
      authRepo: {
        findPasswordResetTokenByHash: vi.fn().mockResolvedValue({
          id: 'reset-1',
          userId: 'user-1',
          tokenHash,
          expiresAt: new Date('2026-05-05T12:30:00.000Z'),
          usedAt: null,
          createdAt: fixedNow,
        }),
        findAuthById: vi.fn().mockResolvedValue(user),
        updatePasswordHash: vi.fn().mockResolvedValue(undefined),
        markPasswordResetTokenUsed: vi.fn().mockResolvedValue(undefined),
      },
      passwordHasher: {
        hash: vi.fn().mockResolvedValue('new-hash'),
      },
      now: () => fixedNow,
    };
    const handler = await resetPassword(deps as any);

    await expect(handler({
      token: 'valid-token',
      newPassword: 'abcdef',
      confirmPassword: 'abcdef',
    })).resolves.toEqual({ ok: true });

    expect(deps.authRepo.findPasswordResetTokenByHash).toHaveBeenCalledWith(tokenHash);
    expect(deps.passwordHasher.hash).toHaveBeenCalledWith('abcdef');
    expect(deps.authRepo.updatePasswordHash).toHaveBeenCalledWith('user-1', 'new-hash');
    expect(deps.authRepo.markPasswordResetTokenUsed).toHaveBeenCalledWith('reset-1', fixedNow);
  });

  it('deve rejeitar token expirado ou usado', async () => {
    const deps = {
      authRepo: {
        findPasswordResetTokenByHash: vi.fn().mockResolvedValue({
          id: 'reset-1',
          userId: 'user-1',
          tokenHash: 'hash',
          expiresAt: new Date('2026-05-05T11:59:59.000Z'),
          usedAt: null,
          createdAt: fixedNow,
        }),
        updatePasswordHash: vi.fn(),
        markPasswordResetTokenUsed: vi.fn(),
      },
      passwordHasher: { hash: vi.fn() },
      now: () => fixedNow,
    };
    const handler = await resetPassword(deps as any);

    await expect(handler({
      token: 'expired-token',
      newPassword: 'abcdef',
      confirmPassword: 'abcdef',
    })).rejects.toThrow(/token/i);
    expect(deps.authRepo.updatePasswordHash).not.toHaveBeenCalled();
    expect(deps.authRepo.markPasswordResetTokenUsed).not.toHaveBeenCalled();
  });

  it('deve rejeitar senha curta e confirmacao diferente', async () => {
    const deps = {
      authRepo: {
        findPasswordResetTokenByHash: vi.fn(),
      },
      passwordHasher: { hash: vi.fn() },
      now: () => fixedNow,
    };
    const handler = await resetPassword(deps as any);

    await expect(handler({
      token: 'token',
      newPassword: '123',
      confirmPassword: '123',
    })).rejects.toThrow(/minimo 6/i);

    await expect(handler({
      token: 'token',
      newPassword: 'abcdef',
      confirmPassword: 'diferente',
    })).rejects.toThrow(/confirmacao/i);

    expect(deps.authRepo.findPasswordResetTokenByHash).not.toHaveBeenCalled();
  });
});
