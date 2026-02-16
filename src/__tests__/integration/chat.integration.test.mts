import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';

describe('Chat (integração)', () => {
  it('deve retornar erro 401 ao enviar mensagem sem autenticação', async () => {
    const res = await request(app)
      .post('/chat/threads/thread-1/messages')
      .send({ content: 'Olá!' });
    expect(res.status).toBe(401);
  });
});
