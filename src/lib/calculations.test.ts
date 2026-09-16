import {
  calculateDirectCost,
  calculateVehicleCostBreakdown,
  calculateProfitAndMargins,
  calculateFipeDiscount,
  parseFipePriceToNumber,
  formatCurrencyBRL,
} from "./calculations";
import { VehicleStatus } from "@prisma/client";
import { assertVehicleStatusTransition } from "./vehicle-lifecycle";

function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    console.error(`❌ FALHOU: ${message}. Esperado: ${expected}, Recebido: ${actual}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSOU: ${message}`);
  }
}

console.log("\n==========================================");
console.log("TESTES DO MOTOR DE CÁLCULO FINANCEIRO (CarZ)");
console.log("==========================================\n");

// 1. Teste de Custo Direto e Detalhamento de Peças + Mão de Obra
// Exemplo do Usuário:
// Troca de pastilhas: R$ 20 de peças + R$ 50 de mão de obra (Total: R$ 70)
// Funilaria: R$ 800 de mão de obra
// Laudo Cautelar: R$ 350 (taxa direta)
const purchasePrice = 95000.00;
const directExpenses = [
  { description: "Troca de pastilhas de freio", partsCost: 20.00, laborCost: 50.00, amount: 70.00 },
  { description: "Pintura parachoque dianteiro", partsCost: 150.00, laborCost: 450.00, amount: 600.00 },
  { description: "Laudo Cautelar de Vistoria", partsCost: 0, laborCost: 0, amount: 350.00 },
];

const totalCost = calculateDirectCost(purchasePrice, directExpenses);
assertEqual(totalCost, 96020.00, "1. Custo Direto Acumulado (Compra + Despesas)");

const breakdown = calculateVehicleCostBreakdown(purchasePrice, directExpenses);
assertEqual(breakdown.totalPartsCost, 170.00, "2.1. Total de Gastos com Peças (20 + 150)");
assertEqual(breakdown.totalLaborCost, 500.00, "2.2. Total de Gastos com Mão de Obra (50 + 450)");
assertEqual(breakdown.totalOtherCost, 350.00, "2.3. Total de Gastos com Taxas/Laudos");
assertEqual(breakdown.totalExpensesCost, 1020.00, "2.4. Total de Gastos Agregados");
assertEqual(breakdown.totalAccumulatedCost, 96020.00, "2.5. Custo Total Acumulado");

// 3. Teste de Lucro, Margem e Markup
// Venda por R$ 110.000,00 com Custo Acumulado de R$ 96.020,00
// Comissão R$ 1.500,00 e Impostos R$ 500,00
const profitMetrics = calculateProfitAndMargins(110000.00, 96020.00, 1500.00, 500.00);
assertEqual(profitMetrics.grossProfit, 13980.00, "3.1. Lucro Bruto (110.000 - 96.020)");
assertEqual(profitMetrics.grossMarginPercentage, 12.71, "3.2. Margem Bruta (%)");
assertEqual(profitMetrics.markupPercentage, 14.56, "3.3. Markup Realizado (%)");
assertEqual(profitMetrics.netProfit, 11980.00, "3.4. Lucro Líquido (13.980 - 2.000)");

// 4. Teste de Deságio FIPE na Compra
const discount = calculateFipeDiscount(82000.00, 100000.00);
assertEqual(discount, 18.00, "4. Deságio FIPE na Compra (%)");

// 5. Teste de Parser de Moeda FIPE
const parsedPrice = parseFipePriceToNumber("R$ 115.820,00");
assertEqual(parsedPrice, 115820.00, "5. Parser de String de Moeda FIPE");

// 6. Ciclo de vida: apenas as transições operacionais previstas são aceitas.
assertVehicleStatusTransition(VehicleStatus.PREPARACAO, VehicleStatus.A_VENDA);
assertEqual(true, true, "6.1. Preparação pode avançar para À Venda");
assertVehicleStatusTransition(VehicleStatus.A_VENDA, VehicleStatus.PREPARACAO);
assertEqual(true, true, "6.2. À Venda pode retornar para Preparação");
try {
  assertVehicleStatusTransition(VehicleStatus.PREPARACAO, VehicleStatus.VENDIDO);
  assertEqual(true, false, "6.3. Venda direta deve ser bloqueada");
} catch {
  assertEqual(true, true, "6.3. Venda direta deve ser bloqueada");
}

console.log("\n==========================================");
console.log("TODOS OS TESTES FINANCEIROS PASSARAM COM SUCESSO!");
console.log("==========================================\n");
