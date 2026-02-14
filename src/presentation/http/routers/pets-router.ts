import { Router } from "express";
import { z } from "zod";
import type multer from "multer";

import type { PetsRepository } from "../../../application/ports/PetsRepository.js";
import type { StorageProvider } from "../../../application/ports/StorageProvider.js";
import type { AuthenticatedRequest } from "../auth-middleware.js";
import { AppError } from "../../../domain/errors/AppError.js";

import { listPets } from "../../../application/use-cases/pets/listPets.js";
import { listMyPets } from "../../../application/use-cases/pets/listMyPets.js";
import { getPet } from "../../../application/use-cases/pets/getPet.js";
import { createPet } from "../../../application/use-cases/pets/createPet.js";
import { updatePet } from "../../../application/use-cases/pets/updatePet.js";
import { addPetPhoto } from "../../../application/use-cases/pets/addPetPhoto.js";
import { favoritePet } from "../../../application/use-cases/pets/favoritePet.js";
import { unfavoritePet } from "../../../application/use-cases/pets/unfavoritePet.js";
import { asyncHandler } from "../async-handler.js";

/**
 * Rotas de pets.
 *
 * Inclui endpoints públicos (listagem/detalhe) e endpoints protegidos para:
 * - SHELTER: criar/editar pet e enviar fotos
 * - ADOPTER: favoritar/desfavoritar
 */

export function createPetsRouter(deps: {
  petsRepo: PetsRepository;
  storageProvider: StorageProvider;
  upload: multer.Multer;
  auth: {
    requireAuth: (req: AuthenticatedRequest, res: any, next: any) => void;
    requireRole: (role: "ADOPTER" | "SHELTER") => (req: AuthenticatedRequest, res: any, next: any) => void;
  };
}) {
  const router = Router();

  const listQuerySchema = z.object({
    status: z.enum(["AVAILABLE", "ADOPTED", "PAUSED"]).optional(),
    species: z.string().optional(),
    q: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  });

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const query = listQuerySchema.parse(req.query);
      const handler = listPets({ petsRepo: deps.petsRepo });
      const result = await handler({
        status: query.status,
        species: query.species,
        q: query.q,
        page: query.page,
        pageSize: query.pageSize,
        order: query.order,
      });
      return res.json(result);
    }),
  );

  router.get(
    "/mine",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = listMyPets({ petsRepo: deps.petsRepo });
      const result = await handler(req.user!.id);
      return res.json(result);
    }),
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
    const handler = getPet({ petsRepo: deps.petsRepo });
    const result = await handler(req.params.id);
    return res.json(result);
    }),
  );

  const createPetSchema = z.object({
    name: z.string().min(1),
    species: z.string().min(1),
    breed: z.string().optional(),
    sex: z.string().optional(),
    ageMonths: z.coerce.number().int().nonnegative().optional(),
    size: z.string().optional(),
    description: z.string().optional(),
  });

  router.post(
    "/",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const body = createPetSchema.parse(req.body);
      const handler = createPet({ petsRepo: deps.petsRepo });
      const result = await handler(req.user!.id, body);
      return res.status(201).json(result);
    }),
  );

  const updatePetSchema = z
    .object({
      name: z.string().min(1).optional(),
      species: z.string().min(1).optional(),
      breed: z.string().nullable().optional(),
      sex: z.string().nullable().optional(),
      ageMonths: z.coerce.number().int().nonnegative().nullable().optional(),
      size: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      status: z.enum(["AVAILABLE", "PAUSED"]).optional(),
    })
    .refine((value) => Object.values(value).some((v) => v !== undefined), {
      message: "Envie ao menos um campo para atualizar",
    });

  router.patch(
    "/:id",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const input = updatePetSchema.parse(req.body);
      const handler = updatePet({ petsRepo: deps.petsRepo });
      const result = await handler({ petId: req.params.id, shelterId: req.user!.id, input });
      return res.json(result);
    }),
  );

  router.post(
    "/:id/photos",
    deps.auth.requireAuth,
    deps.auth.requireRole("SHELTER"),
    deps.upload.single("photo"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      if (!req.file) throw new AppError(400, "Arquivo ausente", "UPLOAD_MISSING_FILE");
      // Salva via StorageProvider (Cloudinary)
      const url = await deps.storageProvider.save(req.file.buffer, req.file.originalname, req.file.mimetype);
      const handler = addPetPhoto({ petsRepo: deps.petsRepo });
      const result = await handler({ petId: req.params.id, shelterId: req.user!.id, url });
      return res.status(201).json(result);
    }),
  );

  router.post(
    "/:id/favorite",
    deps.auth.requireAuth,
    deps.auth.requireRole("ADOPTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = favoritePet({ petsRepo: deps.petsRepo });
      await handler({ userId: req.user!.id, petId: req.params.id });
      return res.status(204).send();
    }),
  );

  router.delete(
    "/:id/favorite",
    deps.auth.requireAuth,
    deps.auth.requireRole("ADOPTER"),
    asyncHandler(async (req: AuthenticatedRequest, res) => {
      const handler = unfavoritePet({ petsRepo: deps.petsRepo });
      await handler({ userId: req.user!.id, petId: req.params.id });
      return res.status(204).send();
    }),
  );

  return router;
}
