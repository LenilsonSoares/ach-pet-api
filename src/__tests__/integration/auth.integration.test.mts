// Definir variáveis de ambiente ANTES de importar o app
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { logExample, saveExamples } from './logExample.js';

describe('Auth (integração)', () => {
  it('deve registrar e logar um usuário', async () => {
    const email = `test${Date.now()}@mail.com`;
    const password = '123456';
    // Registro
    const reg = await request(app)
      .post('/auth/register')
      .send({ name: 'Teste', email, password, role: 'ADOPTER' });
    if (reg.status !== 201) {
      // eslint-disable-next-line no-console
      console.error('auth.register status:', reg.status, 'body:', reg.body);
    }
    expect(reg.status).toBe(201);
    logExample('POST /auth/register', { name: 'Teste', email, password, role: 'ADOPTER' }, reg.body);
    // Login
    const login = await request(app)
      .post('/auth/login')
      .send({ email, password });
    if (login.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('auth.login status:', login.status, 'body:', login.body);
    }
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
    logExample('POST /auth/login', { email, password }, login.body);
    saveExamples();
  });

  it('não deve logar com senha errada', async () => {
    const email = `fail${Date.now()}@mail.com`;
    const password = '123456';
    // Registro
    await request(app)
      .post('/auth/register')
      .send({ name: 'Teste', email, password, role: 'ADOPTER' });
    // Login com senha errada
    const login = await request(app)
      .post('/auth/login')
      .send({ email, password: 'errada' });
    if (login.status !== 401) {
      // eslint-disable-next-line no-console
      console.error('auth.login (senha errada) status:', login.status, 'body:', login.body);
    }
    expect(login.status).toBe(401);
    expect(login.body.token).toBeUndefined();
    expect(login.body.message).toMatch(/senha/i);
  });

  it('não deve logar usuário inexistente', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'naoexiste@x.com', password: 'qualquer' });
    if (login.status !== 401) {
      // eslint-disable-next-line no-console
      console.error('auth.login (usuario inexistente) status:', login.status, 'body:', login.body);
    }
    expect(login.status).toBe(401);
    expect(login.body.token).toBeUndefined();
    expect(login.body.message).toMatch(/usu[aá]rio/i);
  });
});
