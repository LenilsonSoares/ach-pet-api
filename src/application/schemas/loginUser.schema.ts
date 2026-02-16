import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha mínima de 6 caracteres'),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
