const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function http(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = {
    ...(options.headers ?? {}),
  };

  if (options.json !== undefined) {
    headers["content-type"] = "application/json";
  }

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const err = new Error(`${options.method ?? "GET"} ${path} -> ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function printStep(name) {
  process.stdout.write(`- ${name}... `);
}

function ok() {
  process.stdout.write("OK\n");
}

function fail(err) {
  process.stdout.write("FALHOU\n");
  if (err?.status) console.error(`  status: ${err.status}`);
  if (err?.data) console.error("  body:", err.data);
  if (!err?.status) console.error(err);
}

async function main() {
  const runId = nowId();

  printStep("Health");
  const health = await http("/health");
  if (!health?.ok) throw new Error("/health não retornou { ok: true }");
  ok();

  const shelterEmail = `shelter.${runId}@example.com`;
  const adopterEmail = `adopter.${runId}@example.com`;

  printStep("Register shelter");
  const shelterReg = await http("/auth/register", {
    method: "POST",
    json: {
      role: "SHELTER",
      name: "ONG Teste",
      email: shelterEmail,
      password: "123456",
      orgName: "Ach Pet ONG",
    },
  });
  ok();

  printStep("Register adopter");
  const adopterReg = await http("/auth/register", {
    method: "POST",
    json: {
      role: "ADOPTER",
      name: "Adotante Teste",
      email: adopterEmail,
      password: "123456",
    },
  });
  ok();

  const shelterToken = shelterReg?.token;
  const adopterToken = adopterReg?.token;

  if (!shelterToken || !adopterToken) throw new Error("Registro não retornou token");

  printStep("Create pet");
  const createdPet = await http("/pets", {
    method: "POST",
    headers: { authorization: `Bearer ${shelterToken}` },
    json: {
      name: "Bob",
      species: "DOG",
      breed: "SRD",
      ageMonths: 24,
      description: "Pet de teste",
    },
  });
  ok();

  const petId = createdPet?.pet?.id;
  if (!petId) throw new Error("POST /pets não retornou pet.id");

  printStep("Pause pet");
  const paused = await http(`/pets/${petId}`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${shelterToken}` },
    json: { status: "PAUSED" },
  });
  if (paused?.pet?.status !== "PAUSED") throw new Error("PATCH /pets/:id não aplicou status=PAUSED");
  ok();

  printStep("Resume pet");
  const resumed = await http(`/pets/${petId}`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${shelterToken}` },
    json: { status: "AVAILABLE" },
  });
  if (resumed?.pet?.status !== "AVAILABLE") throw new Error("PATCH /pets/:id não aplicou status=AVAILABLE");
  ok();

  printStep("List my pets (shelter)");
  const myPets = await http("/pets/mine", {
    headers: { authorization: `Bearer ${shelterToken}` },
  });
  if (!myPets || !Array.isArray(myPets.pets)) throw new Error("GET /pets/mine não retornou { pets: [] }");
  if (!myPets.pets.some((p) => p.id === petId)) throw new Error("GET /pets/mine não incluiu o pet criado");
  ok();

  printStep("Create adoption request");
  const req = await http("/adoptions/requests", {
    method: "POST",
    headers: { authorization: `Bearer ${adopterToken}` },
    json: { petId, message: "Quero adotar" },
  });
  ok();

  const requestId = req?.request?.id;
  if (!requestId) throw new Error("POST /adoptions/requests não retornou request.id");

  printStep("Approve request");
  const approved = await http(`/adoptions/requests/${requestId}/approve`, {
    method: "POST",
    headers: { authorization: `Bearer ${shelterToken}` },
    json: { followUpDays: 7 },
  });
  ok();

  const adoptionId = approved?.adoption?.id;
  const threadId = approved?.adoption?.thread?.id;
  if (!adoptionId || !threadId) throw new Error("Approve não retornou adoption.id e adoption.thread.id");

  printStep("Send chat message");
  await http(`/chat/threads/${threadId}/messages`, {
    method: "POST",
    headers: { authorization: `Bearer ${adopterToken}` },
    json: { content: "Oi! Tudo bem?" },
  });
  ok();

  printStep("List chat messages");
  const messagesRes = await http(`/chat/threads/${threadId}/messages`, {
    headers: { authorization: `Bearer ${shelterToken}` },
  });
  if (!messagesRes || !Array.isArray(messagesRes.messages)) throw new Error("GET messages não retornou { messages: [] }");
  ok();

  printStep("Create follow-up update");
  await http(`/followup/adoptions/${adoptionId}/updates`, {
    method: "POST",
    headers: { authorization: `Bearer ${adopterToken}` },
    json: { text: "Primeiro dia: tudo certo" },
  });
  ok();

  printStep("List follow-up updates");
  const updatesRes = await http(`/followup/adoptions/${adoptionId}/updates`, {
    headers: { authorization: `Bearer ${shelterToken}` },
  });
  if (!updatesRes || !Array.isArray(updatesRes.updates)) throw new Error("GET updates não retornou { updates: [] }");
  ok();

  printStep("Intervene adoption");
  const intervened = await http(`/adoptions/${adoptionId}/intervene`, {
    method: "POST",
    headers: { authorization: `Bearer ${shelterToken}` },
  });
  if (intervened?.adoption?.status !== "INTERVENTION") {
    throw new Error("POST /adoptions/:adoptionId/intervene não retornou status=INTERVENTION");
  }
  ok();

  console.log("\nSmoke test finalizado com sucesso.");
}

main().catch((err) => {
  fail(err);

  if (err?.status === 500) {
    console.error("\nDica: erro 500 aqui quase sempre é banco indisponível.");
    console.error("- Confirme que o PostgreSQL está rodando");
    console.error("- Confirme o DATABASE_URL no .env");
    console.error("- Rode: npm run prisma:migrate");
  }

  process.exit(1);
});
