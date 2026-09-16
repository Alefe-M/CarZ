import { z } from "zod";

export const GarageRoleEnum = z.enum([
  "OWNER",
  "ADMIN",
  "GERENTE",
  "VENDEDOR",
  "MECANICO",
  "VIEWER",
]);

export const CreateGarageSchema = z.object({
  name: z.string().trim().min(2, "Nome da garagem é obrigatório"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  documentCnpjCpf: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
});

export const InviteMemberSchema = z.object({
  email: z.string().email("E-mail inválido"),
  role: GarageRoleEnum.default("VENDEDOR"),
});

export type CreateGarageInput = z.infer<typeof CreateGarageSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;

