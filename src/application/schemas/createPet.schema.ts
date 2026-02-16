import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  species: z.string().min(2, 'Espécie obrigatória'),
  breed: z.string().optional().nullable(),
  sex: z.enum(['male', 'female']).optional().nullable(),
  ageMonths: z.number().int().min(0).optional().nullable(),
  size: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
