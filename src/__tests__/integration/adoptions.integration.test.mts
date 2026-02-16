import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';

describe('Adoptions (integração)', () => {
  it('deve retornar erro 401 ao solicitar adoção sem autenticação', async () => {
    const res = await request(app)
      .post('/adoptions/requests')
      .send({ petId: 'pet-1', message: 'Quero adotar!' });
    expect(res.status).toBe(401);
  });
});
