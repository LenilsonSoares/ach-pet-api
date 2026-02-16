// Exemplo de teste E2E com Cypress (API)
// Instale: npm install cypress --save-dev

// e2e/register-login-adoption.cy.js

describe('Fluxo completo de adoção', () => {
  it('Registra, faz login e solicita adoção', () => {
    cy.request('POST', '/auth/register', {
      role: 'ADOPTER',
      name: 'Maria E2E',
      email: 'e2e@email.com',
      password: 'Senha123!',
      phone: '+5511999999999'
    }).then((res) => {
      expect(res.status).to.eq(201);
      const token = res.body.token;

      cy.request({
        method: 'POST',
        url: '/adoptions',
        headers: { Authorization: `Bearer ${token}` },
        body: { adopterId: res.body.user.id, petId: 'pet-1', message: 'Quero adotar!' }
      }).then((adoptRes) => {
        expect(adoptRes.status).to.eq(201);
      });
    });
  });
});
