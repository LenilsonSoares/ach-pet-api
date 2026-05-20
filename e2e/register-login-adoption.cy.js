function uniqueId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

describe("Fluxo E2E de adocao", () => {
  it("registra usuarios, cria pet, solicita adocao e valida pos-adocao", () => {
    const runId = uniqueId();
    const password = "Senha123!";

    let shelterToken;
    let adopterToken;
    let petId;
    let requestId;
    let adoptionId;
    let threadId;

    cy.request("GET", "/health")
      .its("body")
      .should("include", { ok: true });

    cy.request("POST", "/auth/register", {
      role: "SHELTER",
      name: "Abrigo Cypress",
      email: `shelter.${runId}@example.com`,
      password,
      orgName: "Ach Pet Cypress",
      cnpj: "19.131.243/0001-97",
      responsible: "Equipe Cypress",
      address: "Rua do Abrigo, 123",
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.token).to.be.a("string");
      shelterToken = response.body.token;
    });

    cy.request("POST", "/auth/register", {
      role: "ADOPTER",
      name: "Adotante Cypress",
      email: `adopter.${runId}@example.com`,
      password,
      phone: "(77) 99999-9999",
      cpf: "529.982.247-25",
      birthDate: "10/05/1990",
      address: "Rua do Adotante, 456",
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.token).to.be.a("string");
      adopterToken = response.body.token;
    });

    cy.then(() => {
      cy.request({
        method: "POST",
        url: "/pets",
        headers: authHeaders(shelterToken),
        body: {
          name: "Bob Cypress",
          species: "DOG",
          breed: "SRD",
          sex: "M",
          ageMonths: 24,
          size: "MEDIUM",
          description: "Pet criado pelo teste E2E Cypress",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.pet).to.include({
          name: "Bob Cypress",
          status: "AVAILABLE",
        });
        petId = response.body.pet.id;
      });
    });

    cy.then(() => {
      cy.request("GET", "/pets?status=AVAILABLE").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.pets).to.be.an("array");
        expect(response.body.pets.some((pet) => pet.id === petId)).to.eq(true);
      });
    });

    cy.then(() => {
      cy.request({
        method: "POST",
        url: "/adoptions/requests",
        headers: authHeaders(adopterToken),
        body: {
          petId,
          message: "Quero adotar este pet pelo fluxo E2E.",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.request.status).to.eq("PENDING");
        requestId = response.body.request.id;
      });
    });

    cy.then(() => {
      cy.request({
        method: "GET",
        url: "/adoptions/requests/inbox",
        headers: authHeaders(shelterToken),
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.requests).to.be.an("array");
        expect(response.body.requests.some((request) => request.id === requestId)).to.eq(true);
      });
    });

    cy.then(() => {
      cy.request({
        method: "POST",
        url: `/adoptions/requests/${requestId}/approve`,
        headers: authHeaders(shelterToken),
        body: { followUpDays: 7 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.adoption.id).to.be.a("string");
        expect(response.body.adoption.followUpDays).to.eq(7);
        expect(response.body.adoption.thread.id).to.be.a("string");
        adoptionId = response.body.adoption.id;
        threadId = response.body.adoption.thread.id;
      });
    });

    cy.then(() => {
      cy.request({
        method: "POST",
        url: `/chat/threads/${threadId}/messages`,
        headers: authHeaders(adopterToken),
        body: { content: "Ola! O processo de adocao foi aprovado." },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message.content).to.contain("processo de adocao");
      });
    });

    cy.then(() => {
      cy.request({
        method: "POST",
        url: `/followup/adoptions/${adoptionId}/updates`,
        headers: authHeaders(adopterToken),
        body: { text: "Primeiro acompanhamento registrado pelo Cypress." },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.update.text).to.contain("Primeiro acompanhamento");
      });
    });

    cy.then(() => {
      cy.request({
        method: "POST",
        url: `/adoptions/${adoptionId}/intervene`,
        headers: authHeaders(shelterToken),
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.adoption.status).to.eq("INTERVENTION");
      });
    });
  });
});
