import { z } from "zod";

export const ExpenseCategoryEnum = z.enum([
  "PECA_ESTOQUE",
  "PECA_COMPRA_DIRETA",
  "SERVICO_MECANICO",
  "FUNILARIA_PINTURA",
  "ESTETICA_HIGIENIZACAO",
  "DOCUMENTACAO_TAXAS",
  "LAUDO_VISTORIA",
  "TRANSPORTE_GUINCHO",
  "OUTRO_DIRETO",
]);

export const GeneralExpenseCategoryEnum = z.enum([
  "ALUGUEL_CONDOMINIO",
  "ENERGIA_AGUA_INTERNET",
  "MARKETING_ANUNCIOS",
  "SALARIOS_PRO_LABORE",
  "COMISSOES_GERAIS",
  "FERRAMENTAS_EQUIPAMENTOS",
  "SOFTWARES_SISTEMAS",
  "IMPOSTOS_TAXAS_EMPRESARIAIS",
  "CONTABILIDADE_JURIDICO",
  "MANUTENCAO_PREDIO_LOJA",
  "OUTRO_GERAL",
]);

export const CreateVehicleExpenseSchema = z.object({
  vehicleId: z.string().uuid("ID do veículo inválido"),
  category: ExpenseCategoryEnum,
  description: z.string().trim().min(2, "Descrição é obrigatória"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  expenseDate: z.string().or(z.date()),
  paymentStatus: z.enum(["PENDENTE", "PAGO", "CANCELADO", "REEMBOLSADO"]).default("PAGO"),
  supplierId: z.string().uuid().optional(),
  receiptFileUrl: z.string().optional(),
});

export const CreateGeneralExpenseSchema = z.object({
  category: GeneralExpenseCategoryEnum,
  description: z.string().trim().min(2, "Descrição é obrigatória"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  dueDate: z.string().or(z.date()),
  paymentDate: z.string().or(z.date()).optional(),
  paymentStatus: z.enum(["PENDENTE", "PAGO", "CANCELADO", "REEMBOLSADO"]).default("PENDENTE"),
  isRecurring: z.boolean().default(false),
  recurrencePeriod: z.string().optional(),
  supplierId: z.string().uuid().optional(),
  documentNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateVehicleExpenseInput = z.infer<typeof CreateVehicleExpenseSchema>;
export type CreateGeneralExpenseInput = z.infer<typeof CreateGeneralExpenseSchema>;

