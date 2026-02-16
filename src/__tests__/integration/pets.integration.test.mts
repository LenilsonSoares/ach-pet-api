import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';

// Teste de integração para endpoints de Pets

describe('Pets (integração)', () => {
  it('deve listar pets (GET /pets)', async () => {
    const res = await request(app).get('/pets');
    if (res.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('pets.list status:', res.status, 'body:', res.body);
    }
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.pets)).toBe(true);
  });

  it('deve retornar erro 401 ao tentar cadastrar pet sem autenticação', async () => {
    const res = await request(app)
      .post('/pets')
      .send({ name: 'Rex', species: 'dog' });
    expect(res.status).toBe(401);
  });

  it('deve retornar erro 400 ao tentar cadastrar pet com dados obrigatórios ausentes', async () => {
    // Primeiro, registra e loga um usuário para obter token
    const email = `pettest${Date.now()}@mail.com`;
    const password = '123456';
    await request(app)
      .post('/auth/register')
      .send({ name: 'Pet Test', email, password, role: 'SHELTER' });
    const login = await request(app)
      .post('/auth/login')
      .send({ email, password });
    const token = login.body.token;
    if (!token) {
      // eslint-disable-next-line no-console
      console.error('pets.cadastro-obrigatorio: token não definido', login.status, login.body);
    }
    expect(token).toBeDefined();
    // Tenta cadastrar pet sem o campo obrigatório 'name'
    const res = await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ species: 'dog' }); // falta o campo name
    if (![400, 422].includes(res.status)) {
      // eslint-disable-next-line no-console
      console.error('pets.cadastro-obrigatorio status:', res.status, 'body:', res.body);
    }
    expect([400, 422]).toContain(res.status); // aceita 400 ou 422
    if (res.body && res.body.message) {
      expect(res.body.message).toMatch(/obrigat[óo]rio|faltando|inv[aá]lido/i);
    }
  });
});
