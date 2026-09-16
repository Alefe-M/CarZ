import prisma from "../prisma";
import { VehicleStatus } from "@prisma/client";
import { calculateDirectCost } from "../calculations";
import Decimal from "decimal.js";

export class DashboardService {
  /**
   * Retorna os KPIs executivos, pipeline das 3 etapas, totais de peças e serviços aplicados e DRE simplificado
   */
  static async getMetrics(garageId: string, referenceDate = new Date()) {
    const periodStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const periodEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
    // 1. Veículos por etapa e custos agregados
    const vehicles = await prisma.vehicle.findMany({
      where: { garageId },
      include: { expenses: true },
    });

    let countPreparacao = 0;
    let countAVenda = 0;
    let countVendido = 0;
    let totalInvestedInStock = new Decimal(0);
    let totalPreparacaoCost = new Decimal(0);
    let totalPartsSpent = new Decimal(0);
    let totalLaborSpent = new Decimal(0);

    for (const v of vehicles) {
      const cost = calculateDirectCost(v.acquisitionPrice, v.expenses);

      for (const exp of v.expenses) {
        totalPartsSpent = totalPartsSpent.plus(exp.partsCost || 0);
        totalLaborSpent = totalLaborSpent.plus(exp.laborCost || 0);
      }

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
      where: {
        garageId,
        saleDate: { gte: periodStart, lt: periodEnd },
      },
    });

    let totalRevenue = new Decimal(0);
    let totalCMV = new Decimal(0);
    let totalGrossProfit = new Decimal(0);
    let totalNetProfit = new Decimal(0);
    let totalCommissions = new Decimal(0);
    let totalTaxes = new Decimal(0);
    let totalOtherDeductions = new Decimal(0);

    for (const s of sales) {
      totalRevenue = totalRevenue.plus(s.finalSalePrice);
      totalCMV = totalCMV.plus(s.totalAccumulatedCost);
      totalGrossProfit = totalGrossProfit.plus(s.grossProfit);
      totalNetProfit = totalNetProfit.plus(s.netProfit);
      totalCommissions = totalCommissions.plus(s.salesCommissionAmount);
      totalTaxes = totalTaxes.plus(s.taxAmount);
      totalOtherDeductions = totalOtherDeductions.plus(s.otherDeductions);
    }

    // 3. Despesas Gerais da Garagem (Fixas)
    const generalExpenses = await prisma.generalExpense.findMany({
      where: {
        garageId,
        dueDate: { gte: periodStart, lt: periodEnd },
      },
    });

    let totalGeneralExpenses = new Decimal(0);
    for (const ge of generalExpenses) {
      totalGeneralExpenses = totalGeneralExpenses.plus(ge.amount);
    }

    // Resultado operacional = lucro líquido das vendas - despesas gerais do período.
    // netProfit já desconta comissão, impostos e outras deduções por venda.
    const operatingResult = totalNetProfit.minus(totalGeneralExpenses);

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
      maintenanceSummary: {
        totalPartsSpent: totalPartsSpent.toDecimalPlaces(2).toNumber(),
        totalLaborSpent: totalLaborSpent.toDecimalPlaces(2).toNumber(),
        totalMaintenance: totalPartsSpent.plus(totalLaborSpent).toDecimalPlaces(2).toNumber(),
      },
      dre: {
        totalRevenue: totalRevenue.toDecimalPlaces(2).toNumber(),
        totalCMV: totalCMV.toDecimalPlaces(2).toNumber(),
        totalGrossProfit: totalGrossProfit.toDecimalPlaces(2).toNumber(),
        totalCommissions: totalCommissions.toDecimalPlaces(2).toNumber(),
        totalTaxes: totalTaxes.toDecimalPlaces(2).toNumber(),
        totalOtherDeductions: totalOtherDeductions.toDecimalPlaces(2).toNumber(),
        totalGeneralExpenses: totalGeneralExpenses.toDecimalPlaces(2).toNumber(),
        operatingResult: operatingResult.toDecimalPlaces(2).toNumber(),
      },
    };
  }
}
