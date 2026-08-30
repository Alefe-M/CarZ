import prisma from "../prisma";
import { CreatePartInput, CreateStockMovementInput } from "../validations/part.schema";
import { calculateWeightedAveragePartCost } from "../calculations";
import { ExpenseCategory, PartMovementType, PaymentStatus } from "@prisma/client";
import Decimal from "decimal.js";

export class PartService {
  /**
   * 1. Lista o catálogo de peças e saldos com indicadores de alerta
   */
  static async listParts(garageId: string) {
    const parts = await prisma.part.findMany({
      where: { garageId },
      include: {
        supplier: true,
      },
      orderBy: { name: "asc" },
    });

    return parts.map((part) => ({
      ...part,
      isLowStock: part.currentStock <= part.minStockAlert,
      totalInventoryValue: new Decimal(part.currentStock)
        .times(part.averageCostPrice)
        .toDecimalPlaces(2)
        .toNumber(),
    }));
  }

  /**
   * 2. Cadastra nova peça no almoxarifado
   */
  static async createPart(garageId: string, input: CreatePartInput) {
    const existing = await prisma.part.findFirst({
      where: { garageId, sku: input.sku },
    });

    if (existing) {
      throw new Error(`Já existe uma peça cadastrada com o SKU "${input.sku}" nesta garagem.`);
    }

    return prisma.part.create({
      data: {
        garageId,
        sku: input.sku,
        oemCode: input.oemCode,
        name: input.name,
        category: input.category,
        unit: input.unit,
        minStockAlert: input.minStockAlert,
        averageCostPrice: new Decimal(input.averageCostPrice),
        defaultSalePrice: input.defaultSalePrice
          ? new Decimal(input.defaultSalePrice)
          : null,
        location: input.location,
        supplierId: input.supplierId,
      },
    });
  }

  /**
   * 3. Registra movimentação de estoque de forma transacional:
   * - Se ENTRADA_COMPRA: aumenta saldo e recalcula custo médio ponderado.
   * - Se SAIDA_APLICACAO_VEICULO: valida saldo, debita estoque e gera VehicleExpense automático!
   */
  static async recordStockMovement(
    garageId: string,
    userId: string,
    input: CreateStockMovementInput
  ) {
    return prisma.$transaction(async (tx) => {
      const part = await tx.part.findFirst({
        where: { id: input.partId, garageId },
      });

      if (!part) {
        throw new Error("Peça não encontrada no almoxarifado desta garagem.");
      }

      const movementQty = input.quantity;
      const unitCost = new Decimal(input.unitCost);
      const totalCost = unitCost.times(movementQty);

      let newStock = part.currentStock;
      let newAverageCost = new Decimal(part.averageCostPrice);

      if (input.movementType === PartMovementType.ENTRADA_COMPRA) {
        // Recalcula custo médio ponderado e incrementa estoque
        const calculatedAvg = calculateWeightedAveragePartCost(
          part.currentStock,
          part.averageCostPrice,
          movementQty,
          unitCost
        );
        newAverageCost = new Decimal(calculatedAvg);
        newStock += movementQty;
      } else if (
        input.movementType === PartMovementType.SAIDA_APLICACAO_VEICULO ||
        input.movementType === PartMovementType.SAIDA_AVULSA_VENDA
      ) {
        if (part.currentStock < movementQty) {
          throw new Error(
            `Saldo insuficiente no almoxarifado! Estoque atual: ${part.currentStock} ${part.unit}, Solicitado: ${movementQty} ${part.unit}.`
          );
        }
        newStock -= movementQty;
      } else if (input.movementType === PartMovementType.AJUSTE_INVENTARIO_POSITIVO) {
        newStock += movementQty;
      } else if (input.movementType === PartMovementType.AJUSTE_INVENTARIO_NEGATIVO) {
        newStock = Math.max(0, newStock - movementQty);
      }

      // 1. Atualiza a peça
      await tx.part.update({
        where: { id: part.id },
        data: {
          currentStock: newStock,
          averageCostPrice: newAverageCost,
        },
      });

      // 2. Cria o registro de movimentação
      const movement = await tx.partStockMovement.create({
        data: {
          garageId,
          partId: part.id,
          movementType: input.movementType,
          quantity: movementQty,
          unitCost,
          totalCost,
          vehicleId: input.vehicleId,
          performedByUserId: userId,
          invoiceNumber: input.invoiceNumber,
          notes: input.notes,
        },
      });

      // 3. Se foi aplicada em um veículo, gera automaticamente o gasto direto na ficha do carro!
      if (
        input.movementType === PartMovementType.SAIDA_APLICACAO_VEICULO &&
        input.vehicleId
      ) {
        const vehicle = await tx.vehicle.findFirst({
          where: { id: input.vehicleId, garageId },
        });

        if (!vehicle) {
          throw new Error("Veículo selecionado para aplicação não encontrado.");
        }

        await tx.vehicleExpense.create({
          data: {
            garageId,
            vehicleId: vehicle.id,
            category: ExpenseCategory.PECA_ESTOQUE,
            description: `Aplicação de Peça: ${movementQty}x ${part.name} (SKU: ${part.sku})`,
            amount: totalCost,
            expenseDate: new Date(),
            paymentStatus: PaymentStatus.PAGO,
            partMovementId: movement.id,
            createdByUserId: userId,
          },
        });
      }

      return movement;
    });
  }
}

