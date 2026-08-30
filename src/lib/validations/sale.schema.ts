import { z } from "zod";

export const PaymentMethodEnum = z.enum([
  "A_VISTA_PIX",
  "A_VISTA_TED",
  "FINANCIAMENTO",
  "CARTAO_CREDITO",
  "CARTA_CONSORCIO",
  "VEICULO_TROCA",
  "MISTO",
]);

export const TradeInVehicleInputSchema = z.object({
  plate: z.string().trim().toUpperCase().min(7).max(7),
  vin: z.string().trim().toUpperCase().min(17).max(17).optional(),
  renavam: z.string().trim().optional(),
  brand: z.string().trim().min(2),
  model: z.string().trim().min(1),
  yearManufacture: z.number().int().optional(),
  yearModel: z.number().int().min(1950),
  color: z.string().default("Não informada"),
  mileageIn: z.number().int().nonnegative().default(0),
  agreedTradeValue: z.number().positive("Valor de avaliação do carro de troca deve ser maior que zero"),
  notes: z.string().optional(),
});

export const CreateSaleTransactionSchema = z.object({
  vehicleId: z.string().uuid("ID do veículo inválido"),
  customerId: z.string().uuid("ID do cliente inválido"),
  saleDate: z.string().or(z.date()),
  finalSalePrice: z.number().positive("Preço final de venda deve ser maior que zero"),
  paymentMethod: PaymentMethodEnum,
  cashAmount: z.number().nonnegative().default(0),
  financedAmount: z.number().nonnegative().default(0),
  salesCommissionAmount: z.number().nonnegative().default(0),
  taxAmount: z.number().nonnegative().default(0),
  otherDeductions: z.number().nonnegative().default(0),
  tradeInVehicle: TradeInVehicleInputSchema.optional(),
  notes: z.string().optional(),
});

export type CreateSaleTransactionInput = z.infer<typeof CreateSaleTransactionSchema>;
export type TradeInVehicleInput = z.infer<typeof TradeInVehicleInputSchema>;

