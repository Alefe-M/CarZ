import {
  calculateDirectCost,
  calculateWeightedAveragePartCost,
  calculateProfitAndMargins,
  calculateFipeDiscount,
  parseFipePriceToNumber,
  formatCurrencyBRL,
} from "./calculations";

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

// 1. Teste de Custo Direto Acumulado
const purchasePrice = 95000.00;
const directExpenses = [
  { amount: 1200.50 }, // Peças
  { amount: 800.00 },   // Funilaria
  { amount: 450.00 },   // Laudo Cautelar
  { amount: 350.25 },   // Higienização
];
const totalCost = calculateDirectCost(purchasePrice, directExpenses);
assertEqual(totalCost, 97800.75, "1. Custo Direto Acumulado (Compra + Despesas)");

// 2. Teste de Custo Médio Ponderado de Estoque
// Saldo atual: 4 pastilhas a R$ 100 cada (Total: R$ 400)
// Nova compra: 6 pastilhas a R$ 120 cada (Total: R$ 720)
// Total 10 pastilhas por R$ 1.120 -> Custo médio = R$ 112,00
const newAvgCost = calculateWeightedAveragePartCost(4, 100.00, 6, 120.00);
assertEqual(newAvgCost, 112.00, "2. Custo Médio Ponderado de Peças em Estoque");

// 3. Teste de Lucro, Margem e Markup
// Venda por R$ 112.000,00 com Custo Acumulado de R$ 97.800,75
// Comissão R$ 1.500,00 e Impostos R$ 500,00
// Lucro Bruto = 112.000 - 97.800,75 = 14.199,25
// Margem Bruta = (14.199,25 / 112.000) * 100 = 12.68%
// Markup = (14.199,25 / 97.800,75) * 100 = 14.52%
// Lucro Líquido = 14.199,25 - 1.500 - 500 = 12.199,25
const profitMetrics = calculateProfitAndMargins(112000.00, 97800.75, 1500.00, 500.00);
assertEqual(profitMetrics.grossProfit, 14199.25, "3.1. Lucro Bruto");
assertEqual(profitMetrics.grossMarginPercentage, 12.68, "3.2. Margem Bruta (%)");
assertEqual(profitMetrics.markupPercentage, 14.52, "3.3. Markup Realizado (%)");
assertEqual(profitMetrics.netProfit, 12199.25, "3.4. Lucro Líquido");

// 4. Teste de Deságio FIPE na Compra
// Carro comprado por R$ 82.000 com FIPE de R$ 100.000 -> 18% de deságio
const discount = calculateFipeDiscount(82000.00, 100000.00);
assertEqual(discount, 18.00, "4. Deságio FIPE na Compra (%)");

// 5. Teste de Parser de Moeda FIPE
const parsedPrice = parseFipePriceToNumber("R$ 115.820,00");
assertEqual(parsedPrice, 115820.00, "5. Parser de String de Moeda FIPE");

// 6. Teste de Formatação de Moeda
const formatted = formatCurrencyBRL(115820.00);
console.log(`✅ PASSOU: 6. Formatação BRL: ${formatted}`);

console.log("\n==========================================");
console.log("TODOS OS TESTES FINANCEIROS PASSARAM COM SUCESSO!");
console.log("==========================================\n");

