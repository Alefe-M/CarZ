import prisma from "../prisma";
import { VehicleStatus } from "@prisma/client";
import { calculateDirectCost } from "../calculations";
import Decimal from "decimal.js";

export class DashboardService {
  /**
   * Retorna os KPIs executivos, pipeline das 3 etapas e DRE simplificado da garagem ativa
   */
  static async getMetrics(garageId: string) {
    // 1. Veículos por etapa
    const vehicles = await prisma.vehicle.findMany({
      where: { garageId },
      include: { expenses: true },
    });

    let countPreparacao = 0;
    let countAVenda = 0;
    let countVendido = 0;
    let totalInvestedInStock = new Decimal(0);
    let totalPreparacaoCost = new Decimal(0);

    for (const v of vehicles) {
      const cost = calculateDirectCost(v.acquisitionPrice, v.expenses);

      if (v.status === VehicleStatus.PREPARACAO) {
        countPreparacao++;
        totalPreparacaoCost = totalPreparacaoCost.plus(cost);
        totalInvestedInStock = totalInvestedInStock.plus(cost);
      } else if (v.status === VehicleStatus.A_VENDA) {
        countAVenda++;
        totalInvestedInStock = totalInvestedInStock.plus(cost);
      } else if (v.status === VehicleStatus.VENDIDO) {
        countVendido++;
      }
    }

    // 2. Vendas e DRE consolidado
    const sales = await prisma.saleTransaction.findMany({
      where: { garageId },
    });

    let totalRevenue = new Decimal(0);
    let totalCMV = new Decimal(0);
    let totalGrossProfit = new Decimal(0);
    let totalNetProfit = new Decimal(0);
    let totalCommissions = new Decimal(0);

    for (const s of sales) {
      totalRevenue = totalRevenue.plus(s.finalSalePrice);
      totalCMV = totalCMV.plus(s.totalAccumulatedCost);
      totalGrossProfit = totalGrossProfit.plus(s.grossProfit);
      totalNetProfit = totalNetProfit.plus(s.netProfit);
      totalCommissions = totalCommissions.plus(s.salesCommissionAmount);
    }

    // 3. Despesas Gerais da Garagem
    const generalExpenses = await prisma.generalExpense.findMany({
      where: { garageId },
    });

    let totalGeneralExpenses = new Decimal(0);
    for (const ge of generalExpenses) {
      totalGeneralExpenses = totalGeneralExpenses.plus(ge.amount);
    }

    // Resultado Operacional Final = Lucro Bruto - Despesas Gerais - Comissões
    const operatingResult = totalGrossProfit
      .minus(totalGeneralExpenses)
      .minus(totalCommissions);

    // 4. Peças com Estoque Crítico
    const lowStockParts = await prisma.part.findMany({
      where: {
        garageId,
        currentStock: { lte: prisma.part.fields.minStockAlert },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        currentStock: true,
        minStockAlert: true,
        unit: true,
      },
    });

    return {
      pipeline: {
        preparacao: countPreparacao,
        aVenda: countAVenda,
        vendido: countVendido,
        totalAtivoEmPatio: countPreparacao + countAVenda,
      },
      capital: {
        totalInvestedInStock: totalInvestedInStock.toDecimalPlaces(2).toNumber(),
        totalPreparacaoCost: totalPreparacaoCost.toDecimalPlaces(2).toNumber(),
      },
      dre: {
        totalRevenue: totalRevenue.toDecimalPlaces(2).toNumber(),
        totalCMV: totalCMV.toDecimalPlaces(2).toNumber(),
        totalGrossProfit: totalGrossProfit.toDecimalPlaces(2).toNumber(),
        totalCommissions: totalCommissions.toDecimalPlaces(2).toNumber(),
        totalGeneralExpenses: totalGeneralExpenses.toDecimalPlaces(2).toNumber(),
        operatingResult: operatingResult.toDecimalPlaces(2).toNumber(),
      },
      lowStockPartsCount: lowStockParts.length,
      lowStockParts,
    };
  }
}

