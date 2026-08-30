import { FipeService } from "./services/fipe.service";
import { calculateFipeDiscount, formatCurrencyBRL } from "./calculations";

async function runFipeIntegrationTest() {
  console.log("\n==========================================");
  console.log("TESTE DE INTEGRAÇÃO REAL: FIPE (Parallelum API)");
  console.log("==========================================\n");

  try {
    // 1. Listar Marcas
    console.log("1. Consultando Marcas de Carros...");
    const brands = await FipeService.getBrands();
    console.log(`✅ Sucesso: ${brands.length} marcas retornadas.`);
    const toyota = brands.find((b) => b.nome.toLowerCase().includes("toyota"));
    if (!toyota) throw new Error("Marca Toyota não encontrada!");
    console.log(`   Marca Selecionada: ${toyota.nome} (Código: ${toyota.codigo})`);

    // 2. Listar Modelos da Toyota
    console.log("\n2. Consultando Modelos da Toyota...");
    const modelsResponse = await FipeService.getModels(toyota.codigo);
    console.log(`✅ Sucesso: ${modelsResponse.modelos.length} modelos retornados.`);
    const corolla = modelsResponse.modelos.find((m) =>
      m.nome.toLowerCase().includes("corolla")
    );
    if (!corolla) throw new Error("Modelo Corolla não encontrado!");
    console.log(`   Modelo Selecionado: ${corolla.nome} (Código: ${corolla.codigo})`);

    // 3. Listar Anos do Corolla
    console.log("\n3. Consultando Anos/Combustíveis do Corolla...");
    const years = await FipeService.getYears(toyota.codigo, corolla.codigo);
    console.log(`✅ Sucesso: ${years.length} anos disponíveis.`);
    const yearChoice = years[0];
    console.log(`   Ano Selecionado: ${yearChoice.nome} (Código: ${yearChoice.codigo})`);

    // 4. Consultar Avaliação Oficial FIPE
    console.log("\n4. Consultando Ficha e Valor Oficial FIPE...");
    const valuation = await FipeService.getValuation(
      toyota.codigo,
      corolla.codigo,
      yearChoice.codigo
    );
    console.log(`✅ Preço Oficial FIPE: ${valuation.Valor} (Numérico: ${valuation.valorNumerico})`);
    console.log(`   Código FIPE: ${valuation.CodigoFipe} | Mês Ref: ${valuation.MesReferencia}`);

    // 5. Simular Deságio de Compra no CarZ
    const purchasePrice = (valuation.valorNumerico || 100000) * 0.82; // 18% abaixo
    const discount = calculateFipeDiscount(purchasePrice, valuation.valorNumerico || 100000);
    console.log(`\n5. Simulação de Aquisição na Garagem:`);
    console.log(`   Valor de Compra: ${formatCurrencyBRL(purchasePrice)}`);
    console.log(`   Deságio Calculado: ${discount}% abaixo da FIPE`);

    console.log("\n==========================================");
    console.log("INTEGRAÇÃO FIPE VALIDADA COM SUCESSO!");
    console.log("==========================================\n");
  } catch (error: any) {
    console.error("❌ Erro no teste FIPE:", error.message);
    process.exit(1);
  }
}

runFipeIntegrationTest();

