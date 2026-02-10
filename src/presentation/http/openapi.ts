export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Ach Pet API",
    version: "0.1.0",
    description: "API do projeto Ach Pet (adoção responsável + acompanhamento pós-adoção).",
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Pets" },
    { name: "Adoptions" },
    { name: "Chat" },
    { name: "Follow-up" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              code: { type: "string" },
              issues: { type: "array", items: {} },
            },
            required: ["message", "code"],
          },
        },
        required: ["error"],
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              role: { type: "string", enum: ["ADOPTER", "SHELTER"] },
              name: { type: "string" },
              email: { type: "string" },
            },
            required: ["id", "role", "name", "email"],
          },
          token: { type: "string" },
        },
        required: ["user", "token"],
      },
      Pet: {
        type: "object",
        properties: {
          id: { type: "string" },
          shelterId: { type: "string" },
          name: { type: "string" },
          species: { type: "string" },
          breed: { type: ["string", "null"] },
          sex: { type: ["string", "null"] },
          ageMonths: { type: ["integer", "null"] },
          size: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
          status: { type: "string", enum: ["AVAILABLE", "ADOPTED", "PAUSED"] },
          photos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                url: { type: "string" },
              },
              required: ["id", "url"],
            },
          },
          shelter: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
            required: ["id", "name"],
          },
          createdAt: { type: "string" },
        },
        required: ["id", "shelterId", "name", "species", "status", "photos", "shelter", "createdAt"],
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean" } },
                  required: ["ok"],
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Cadastro (ADOPTER ou SHELTER)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role: { type: "string", enum: ["ADOPTER", "SHELTER"] },
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  phone: { type: "string" },
                  orgName: { type: "string" },
                },
                required: ["role", "name", "email", "password"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Criado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
            },
          },
          "400": { description: "Erro", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { email: { type: "string" }, password: { type: "string" } },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
            },
          },
          "400": { description: "Erro", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/pets": {
      get: {
        tags: ["Pets"],
        summary: "Listar pets (público)",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["AVAILABLE", "ADOPTED", "PAUSED"] } },
          { name: "species", in: "query", schema: { type: "string" } },
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pets: { type: "array", items: { $ref: "#/components/schemas/Pet" } },
                    page: { type: "integer" },
                    pageSize: { type: "integer" },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                  },
                  required: ["pets", "page", "pageSize", "total", "totalPages"],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Pets"],
        summary: "Criar pet (SHELTER)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  species: { type: "string" },
                  breed: { type: "string" },
                  sex: { type: "string" },
                  ageMonths: { type: "integer" },
                  size: { type: "string" },
                  description: { type: "string" },
                },
                required: ["name", "species"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { pet: { $ref: "#/components/schemas/Pet" } },
                  required: ["pet"],
                },
              },
            },
          },
          "401": { description: "Não autenticado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Sem permissão", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/pets/mine": {
      get: {
        tags: ["Pets"],
        summary: "Listar meus pets (SHELTER)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { pets: { type: "array", items: { $ref: "#/components/schemas/Pet" } } },
                  required: ["pets"],
                },
              },
            },
          },
        },
      },
    },
    "/pets/{id}": {
      get: {
        tags: ["Pets"],
        summary: "Detalhar pet (público)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { pet: { $ref: "#/components/schemas/Pet" } },
                  required: ["pet"],
                },
              },
            },
          },
          "404": { description: "Não encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      patch: {
        tags: ["Pets"],
        summary: "Atualizar/pausar/reativar pet (SHELTER dono)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  species: { type: "string" },
                  breed: { type: ["string", "null"] },
                  sex: { type: ["string", "null"] },
                  ageMonths: { type: ["integer", "null"] },
                  size: { type: ["string", "null"] },
                  description: { type: ["string", "null"] },
                  status: { type: "string", enum: ["AVAILABLE", "PAUSED"] },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { pet: { $ref: "#/components/schemas/Pet" } },
                  required: ["pet"],
                },
              },
            },
          },
          "401": { description: "Não autenticado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Sem permissão", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Não encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/adoptions/{adoptionId}/intervene": {
      post: {
        tags: ["Adoptions"],
        summary: "Intervir na adoção (SHELTER)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "adoptionId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    adoption: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        status: { type: "string", enum: ["ACTIVE", "COMPLETED", "INTERVENTION", "CANCELED"] },
                      },
                      required: ["id", "status"],
                    },
                  },
                  required: ["adoption"],
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
