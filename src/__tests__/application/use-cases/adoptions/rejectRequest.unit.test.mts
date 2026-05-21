import { describe, expect, it, vi } from "vitest";

import { rejectRequest } from "../../../../application/use-cases/adoptions/rejectRequest.js";

describe("rejectRequest", () => {
  it("deve exigir motivo da recusa", async () => {
    const adoptionsRepo = {
      getRequestForDecision: vi.fn(),
      rejectRequest: vi.fn(),
    };

    const handler = rejectRequest({ adoptionsRepo: adoptionsRepo as any });

    await expect(
      handler({ shelterId: "shelter-1", requestId: "request-1", rejectionReason: "  " }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Informe o motivo da recusa",
    });

    expect(adoptionsRepo.getRequestForDecision).not.toHaveBeenCalled();
    expect(adoptionsRepo.rejectRequest).not.toHaveBeenCalled();
  });

  it("deve salvar motivo normalizado ao recusar solicitacao pendente", async () => {
    const request = {
      id: "request-1",
      shelterId: "shelter-1",
      petId: "pet-1",
      status: "PENDING",
    };
    const updated = {
      ...request,
      adopterId: "adopter-1",
      message: null,
      rejectionReason: "Perfil incompativel com as necessidades do pet.",
      status: "REJECTED",
      createdAt: new Date(),
    };
    const adoptionsRepo = {
      getRequestForDecision: vi.fn().mockResolvedValue(request),
      rejectRequest: vi.fn().mockResolvedValue(updated),
    };

    const handler = rejectRequest({ adoptionsRepo: adoptionsRepo as any });
    const result = await handler({
      shelterId: "shelter-1",
      requestId: "request-1",
      rejectionReason: "  Perfil incompativel com as necessidades do pet.  ",
    });

    expect(adoptionsRepo.rejectRequest).toHaveBeenCalledWith(
      "request-1",
      "Perfil incompativel com as necessidades do pet.",
    );
    expect(result).toEqual({ request: updated });
  });
});
