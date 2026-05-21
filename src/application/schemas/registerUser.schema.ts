import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha mínima de 6 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['ADOPTER', 'SHELTER']),
  orgName: z.string().optional(),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  cnpj: z.string().optional(),
  responsible: z.string().optional(),
  site: z.string().optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
