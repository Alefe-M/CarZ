import { z } from "zod";

export const CreateCustomerSchema = z.object({
  name: z.string().trim().min(2, "Nome do cliente é obrigatório."),
  documentCpfCnpj: z.string().trim().min(11, "CPF/CNPJ é obrigatório."),
  phone: z.string().trim().min(8, "Telefone é obrigatório."),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().max(2).optional(),
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
