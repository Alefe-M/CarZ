import prisma from "../prisma";
import { CreateSaleTransactionInput } from "../validations/sale.schema";
import { calculateDirectCost, calculateProfitAndMargins } from "../calculations";
import { VehicleAcquisitionType, VehicleStatus } from "@prisma/client";
import Decimal from "decimal.js";

export class SaleService {
  /**
   * 1. Registra a venda de um veículo, liquida a negociação e processa Trade-in
   */
  static async createSale(
    garageId: string,
    sellerUserId: string,
    input: CreateSaleTransactionInput
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Busca o veículo e seus gastos acumulados
      const vehicle = await tx.vehicle.findFirst({
        where: { id: input.vehicleId, garageId },
        include: { expenses: true },
      });

      if (!vehicle) {
        throw new Error("Veículo não encontrado nesta garagem.");
      }

      if (vehicle.status === VehicleStatus.VENDIDO) {
        throw new Error("Este veículo já foi vendido anteriormente.");
      }
      if (vehicle.status !== VehicleStatus.A_VENDA) {
        throw new Error("A venda só pode ser concluída para veículos disponíveis à venda.");
      }

      const customer = await tx.customer.findFirst({
        where: { id: input.customerId, garageId },
        select: { id: true },
      });
      if (!customer) {
        throw new Error("Cliente não encontrado nesta garagem.");
      }

      // 2. Calcula o custo direto acumulado total até o fechamento da venda
      const totalAccumulatedCost = calculateDirectCost(
        vehicle.acquisitionPrice,
        vehicle.expenses
      );

      // 3. Calcula lucratividade líquida e bruta
      const tradeInValue = input.tradeInVehicle?.agreedTradeValue || 0;
      const profitMetrics = calculateProfitAndMargins(
        input.finalSalePrice,
        totalAccumulatedCost,
        input.salesCommissionAmount,
        input.taxAmount,
        input.otherDeductions
      );

      // 4. Cria a transação de venda com congelamento histórico dos valores
      const sale = await tx.saleTransaction.create({
        data: {
          garageId,
          vehicleId: vehicle.id,
          customerId: input.customerId,
          sellerUserId,
          saleDate: new Date(input.saleDate),
          finalSalePrice: new Decimal(input.finalSalePrice),
          paymentMethod: input.paymentMethod,
          cashAmount: new Decimal(input.cashAmount),
          financedAmount: new Decimal(input.financedAmount),
          salesCommissionAmount: new Decimal(input.salesCommissionAmount),
          taxAmount: new Decimal(input.taxAmount),
          otherDeductions: new Decimal(input.otherDeductions),
          tradeInValue: new Decimal(tradeInValue),
          totalAccumulatedCost: new Decimal(totalAccumulatedCost),
          grossProfit: new Decimal(profitMetrics.grossProfit),
          netProfit: new Decimal(profitMetrics.netProfit),
          notes: input.notes,
        },
      });

      // 5. Altera o status do veículo vendido para 3ª Etapa: VENDIDO
      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: {
          status: VehicleStatus.VENDIDO,
        },
      });

      // 6. REGRA ESPECIAL DE TRADE-IN (Carro na Troca):
      // Se um veículo entrou como parte de pagamento, cadastra-o automaticamente no estoque em [PREPARACAO]
      if (input.tradeInVehicle && tradeInValue > 0) {
        const tradeIn = input.tradeInVehicle;

        // Normaliza a placa para no máximo 7 caracteres
        const cleanPlate = (tradeIn.plate || "TROCA01")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase()
          .slice(0, 7)
          .padEnd(7, "0");

        // Gera VIN fictício com exatamente 17 caracteres (limite do db.VarChar(17))
        const timestampStr = Date.now().toString();
        const cleanVin = tradeIn.vin
          ? tradeIn.vin.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 17).padEnd(17, "0")
          : `TRC${timestampStr.slice(-14)}`; // 3 + 14 = 17 caracteres

        // Renavam com no máximo 11 caracteres (limite do db.VarChar(11))
        const cleanRenavam = tradeIn.renavam
          ? tradeIn.renavam.replace(/[^0-9]/g, "").slice(0, 11).padEnd(11, "0")
          : "00000000000";

        await tx.vehicle.create({
          data: {
            garageId,
            plate: cleanPlate,
            vin: cleanVin,
            renavam: cleanRenavam,
            brand: tradeIn.brand,
            model: tradeIn.model,
            version: tradeIn.notes || undefined,
            yearManufacture: tradeIn.yearManufacture || tradeIn.yearModel,
            yearModel: tradeIn.yearModel,
            color: tradeIn.color || "Prata",
            mileageIn: tradeIn.mileageIn || 0,
            mileageCurrent: tradeIn.mileageIn || 0,
            status: VehicleStatus.PREPARACAO, // Novo carro entra direto na 1ª Etapa
            acquisitionType: VehicleAcquisitionType.TROCA_TRADE_IN,
            acquisitionDate: new Date(input.saleDate),
            acquisitionPrice: new Decimal(tradeIn.agreedTradeValue),
            tradeInFromSaleId: sale.id, // Vínculo com a venda de origem
            notes: `Veículo recebido na troca na venda do ${vehicle.brand} ${vehicle.model} (${vehicle.plate}). ${tradeIn.notes || ""}`.trim(),
          },
        });
      }

      return sale;
    });
  }

  /**
   * 2. Lista o histórico de vendas realizadas na garagem
   */
  static async listSales(garageId: string) {
    return prisma.saleTransaction.findMany({
      where: { garageId },
      include: {
        vehicle: true,
        customer: true,
        sellerUser: { select: { id: true, name: true } },
        tradeInVehicle: true,
      },
      orderBy: { saleDate: "desc" },
    });
  }
}

