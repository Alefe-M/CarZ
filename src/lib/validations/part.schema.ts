import { z } from "zod";

export const PartMovementTypeEnum = z.enum([
  "ENTRADA_COMPRA",
  "SAIDA_APLICACAO_VEICULO",
  "SAIDA_AVULSA_VENDA",
  "AJUSTE_INVENTARIO_POSITIVO",
  "AJUSTE_INVENTARIO_NEGATIVO",
]);

export const CreatePartSchema = z.object({
  sku: z.string().trim().min(2, "SKU é obrigatório"),
  oemCode: z.string().trim().optional(),
  name: z.string().trim().min(2, "Nome da peça é obrigatório"),
  category: z.string().trim().min(2, "Categoria é obrigatória"),
  unit: z.string().trim().default("UN"),
  minStockAlert: z.number().int().min(0).default(2),
  averageCostPrice: z.number().nonnegative("Custo médio deve ser zero ou maior"),
  defaultSalePrice: z.number().positive().optional(),
  location: z.string().optional(),
  supplierId: z.string().uuid().optional(),
});

export const CreateStockMovementSchema = z.object({
  partId: z.string().uuid("ID da peça inválido"),
  movementType: PartMovementTypeEnum,
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
  unitCost: z.number().nonnegative("Custo unitário deve ser positivo ou zero"),
  vehicleId: z.string().uuid("ID do veículo inválido").optional(),
  invoiceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type CreatePartInput = z.infer<typeof CreatePartSchema>;
export type CreateStockMovementInput = z.infer<typeof CreateStockMovementSchema>;

