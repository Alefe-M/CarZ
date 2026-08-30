import { z } from "zod";

export const VehicleStatusEnum = z.enum(["PREPARACAO", "A_VENDA", "VENDIDO"]);
export const VehicleAcquisitionTypeEnum = z.enum([
  "COMPRA_DIRETA_PF",
  "COMPRA_DIRETA_PJ",
  "LEILAO",
  "TROCA_TRADE_IN",
  "CONSIGNADO",
]);
export const FuelTypeEnum = z.enum([
  "FLEX",
  "GASOLINA",
  "ETANOL",
  "DIESEL",
  "HIBRIDO",
  "ELETRICO",
  "GNV",
]);
export const TransmissionTypeEnum = z.enum([
  "MANUAL",
  "AUTOMATICO",
  "AUTOMATIZADO",
  "CVT",
]);

export const CreateVehicleSchema = z.object({
  plate: z
    .string()
    .trim()
    .toUpperCase()
    .min(7, "A placa deve ter pelo menos 7 caracteres")
    .max(7, "A placa deve ter no máximo 7 caracteres"),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .min(17, "O chassi deve ter 17 caracteres")
    .max(17, "O chassi deve ter 17 caracteres"),
  renavam: z
    .string()
    .trim()
    .min(9, "Renavam deve ter entre 9 e 11 dígitos")
    .max(11, "Renavam deve ter entre 9 e 11 dígitos"),
  brand: z.string().trim().min(2, "Marca é obrigatória"),
  model: z.string().trim().min(1, "Modelo é obrigatório"),
  version: z.string().trim().optional(),
  yearManufacture: z.number().int().min(1950).max(new Date().getFullYear() + 2),
  yearModel: z.number().int().min(1950).max(new Date().getFullYear() + 2),
  color: z.string().trim().min(2, "Cor é obrigatória"),
  fuelType: FuelTypeEnum.default("FLEX"),
  transmission: TransmissionTypeEnum.default("MANUAL"),
  mileageIn: z.number().int().min(0, "KM de entrada não pode ser negativo"),
  acquisitionType: VehicleAcquisitionTypeEnum.default("COMPRA_DIRETA_PF"),
  acquisitionDate: z.string().or(z.date()),
  acquisitionPrice: z.number().positive("Preço de aquisição deve ser maior que zero"),
  fipeCode: z.string().optional(),
  fipePriceAtAcquisition: z.number().optional(),
  fipeReferenceMonth: z.string().optional(),
  targetSalePrice: z.number().positive("Preço alvo deve ser positivo").optional(),
  minimumSalePrice: z.number().positive("Preço mínimo deve ser positivo").optional(),
  supplierId: z.string().uuid("ID do fornecedor inválido").optional(),
  notes: z.string().optional(),
});

export const UpdateVehicleStatusSchema = z.object({
  status: VehicleStatusEnum,
  notes: z.string().optional(),
});

export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicleStatusInput = z.infer<typeof UpdateVehicleStatusSchema>;

