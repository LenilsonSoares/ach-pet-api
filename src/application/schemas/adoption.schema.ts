import { z } from 'zod';

export const createAdoptionSchema = z.object({
  petId: z.string().min(1, 'ID do pet obrigatório'),
  adopterId: z.string().min(1, 'ID do adotante obrigatório'),
});

export type CreateAdoptionInput = z.infer<typeof createAdoptionSchema>;
