import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export interface DirectExpenseItem {
  amount: number | string | Decimal;
  partsCost?: number | string | Decimal;
  laborCost?: number | string | Decimal;
  category?: string;
}

export interface VehicleCostBreakdown {
  acquisitionPrice: number;
  totalPartsCost: number;
  totalLaborCost: number;
  totalOtherCost: number;
  totalExpensesCost: number;
  totalAccumulatedCost: number;
}

export interface ProfitAndMarginsResult {
  grossProfit: number;
  grossMarginPercentage: number;
  markupPercentage: number;
  netProfit: number;
}

/**
 * 1. Calcula o Custo Direto Acumulado Total do Veículo:
 * C_direto = Preço de Aquisição + Soma de todas as despesas (Peças + Mão de Obra + Taxas)
 */
export function calculateDirectCost(
  acquisitionPrice: number | string | Decimal,
  expenses: DirectExpenseItem[] = []
): number {
  let total = new Decimal(acquisitionPrice || 0);

  for (const exp of expenses) {
    total = total.plus(new Decimal(exp.amount || 0));
  }

  return total.toDecimalPlaces(2).toNumber();
}

/**
 * 2. Detalha o Dossiê de Gastos do Veículo (Total de Peças, Total de Mão de Obra/Serviço e Outros)
 */
export function calculateVehicleCostBreakdown(
  acquisitionPrice: number | string | Decimal,
  expenses: DirectExpenseItem[] = []
): VehicleCostBreakdown {
  const acq = new Decimal(acquisitionPrice || 0);
  let totalParts = new Decimal(0);
  let totalLabor = new Decimal(0);
  let totalOther = new Decimal(0);
  let totalExp = new Decimal(0);

  for (const exp of expenses) {
    const pCost = new Decimal(exp.partsCost || 0);
    const lCost = new Decimal(exp.laborCost || 0);
    const totalAmount = new Decimal(exp.amount || 0);

    totalParts = totalParts.plus(pCost);
    totalLabor = totalLabor.plus(lCost);
    totalExp = totalExp.plus(totalAmount);

    // Se o gasto não tiver detalhamento de peças nem mão de obra (ex: IPVA/Laudo), entra como outros
    const remainder = totalAmount.minus(pCost).minus(lCost);
    if (remainder.greaterThan(0)) {
      totalOther = totalOther.plus(remainder);
    }
  }

  const totalAccumulated = acq.plus(totalExp);

  return {
    acquisitionPrice: acq.toDecimalPlaces(2).toNumber(),
    totalPartsCost: totalParts.toDecimalPlaces(2).toNumber(),
    totalLaborCost: totalLabor.toDecimalPlaces(2).toNumber(),
    totalOtherCost: totalOther.toDecimalPlaces(2).toNumber(),
    totalExpensesCost: totalExp.toDecimalPlaces(2).toNumber(),
    totalAccumulatedCost: totalAccumulated.toDecimalPlaces(2).toNumber(),
  };
}

/**
 * 3. Apura a Lucratividade, Margens e Markup na Venda:
 * - Lucro Bruto = Preço de Venda - Custo Total Acumulado
 * - Margem Bruta (%) = (Lucro Bruto / Preço de Venda) * 100
 * - Markup (%) = (Lucro Bruto / Custo Total Acumulado) * 100
 * - Lucro Líquido = Lucro Bruto - Comissões - Impostos - Outras Deduções
 */
export function calculateProfitAndMargins(
  salePrice: number | string | Decimal,
  accumulatedCost: number | string | Decimal,
  commissionAmount: number | string | Decimal = 0,
  taxAmount: number | string | Decimal = 0,
  otherDeductions: number | string | Decimal = 0
): ProfitAndMarginsResult {
  const price = new Decimal(salePrice || 0);
  const cost = new Decimal(accumulatedCost || 0);
  const commission = new Decimal(commissionAmount || 0);
  const tax = new Decimal(taxAmount || 0);
  const deductions = new Decimal(otherDeductions || 0);

  const grossProfit = price.minus(cost);

  const grossMarginPercentage = price.isZero()
    ? 0
    : grossProfit.dividedBy(price).times(100).toDecimalPlaces(2).toNumber();

  const markupPercentage = cost.isZero()
    ? 0
    : grossProfit.dividedBy(cost).times(100).toDecimalPlaces(2).toNumber();

  const netProfit = grossProfit
    .minus(commission)
    .minus(tax)
    .minus(deductions)
    .toDecimalPlaces(2)
    .toNumber();

  return {
    grossProfit: grossProfit.toDecimalPlaces(2).toNumber(),
    grossMarginPercentage,
    markupPercentage,
    netProfit,
  };
}

/**
 * 4. Calcula o Deságio na Compra vs Tabela FIPE (% abaixo da FIPE):
 * Deságio (%) = ((FIPE - Preço de Compra) / FIPE) * 100
 */
export function calculateFipeDiscount(
  acquisitionPrice: number | string | Decimal,
  fipePrice: number | string | Decimal
): number {
  const fipe = new Decimal(fipePrice || 0);
  const acquisition = new Decimal(acquisitionPrice || 0);

  if (fipe.isZero()) return 0;

  const discount = fipe.minus(acquisition).dividedBy(fipe).times(100);
  return discount.toDecimalPlaces(2).toNumber();
}

/**
 * 5. Sanitiza strings de moeda retornadas pela FipeAPI (ex: "R$ 115.820,00" -> 115820.00)
 */
export function parseFipePriceToNumber(fipePriceString: string | null | undefined): number {
  if (!fipePriceString) return 0;

  const sanitized = fipePriceString
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * 6. Formata número para formato monetário brasileiro BRL (R$ 1.234,56)
 */
export function formatCurrencyBRL(value: number | string | Decimal): string {
  const num = new Decimal(value || 0).toNumber();
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}
