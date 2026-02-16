import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha mínima de 6 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['ADOPTER', 'SHELTER']),
  orgName: z.string().optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
