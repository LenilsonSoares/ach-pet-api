import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';

describe('Followup (integração)', () => {
  it('deve retornar erro 401 ao enviar atualização sem autenticação', async () => {
    const res = await request(app)
      .post('/followup/adoptions/adoption-1/updates')
      .send({ text: 'Tudo bem!', photoUrl: 'https://...' });
    expect(res.status).toBe(401);
  });
});
