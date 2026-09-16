import { z } from "zod";

export const ExpenseCategoryEnum = z.enum([
  "MANUTENCAO_MECANICA",
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

export const CreateVehicleExpenseSchema = z
  .object({
    vehicleId: z.string().uuid("ID do veículo inválido"),
    category: ExpenseCategoryEnum,
    description: z.string().trim().min(2, "Descrição do gasto/serviço é obrigatória"),
    partsCost: z.number().nonnegative("Valor de peças não pode ser negativo").default(0),
    laborCost: z.number().nonnegative("Valor de mão de obra não pode ser negativo").default(0),
    amount: z.number().nonnegative().optional(),
    expenseDate: z.string().or(z.date()),
    paymentStatus: z.enum(["PENDENTE", "PAGO", "CANCELADO", "REEMBOLSADO"]).default("PAGO"),
    supplierId: z.string().uuid().optional(),
    receiptFileUrl: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.amount !== undefined && data.amount < data.partsCost + data.laborCost) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "O total não pode ser menor que peças mais mão de obra.",
      });
    }
  })
  .transform((data) => {
    // Se o amount não for informado explicitamente, calcula como partsCost + laborCost
    const calculatedAmount =
      data.amount !== undefined && data.amount > 0
        ? data.amount
        : data.partsCost + data.laborCost;

    return {
      ...data,
      amount: calculatedAmount > 0 ? calculatedAmount : 0,
    };
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
