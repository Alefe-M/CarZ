import { PrismaClient, GarageRole, VehicleStatus, VehicleAcquisitionType, ExpenseCategory, PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";
import Decimal from "decimal.js";

const prisma = new PrismaClient();

async function main() {
  console.log("\n🌱 Iniciando Seed do Banco de Dados CarZ...\n");

  // 1. Limpa dados antigos (na ordem correta de integridade)
  await prisma.saleTransaction.deleteMany();
  await prisma.vehicleExpense.deleteMany();
  await prisma.generalExpense.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.garageMember.deleteMany();
  await prisma.garageInvite.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.garage.deleteMany();
  await prisma.user.deleteMany();

  // 2. Cria Usuário Administrador
  const passwordHash = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Álefe Gestor",
      email: "admin@carz.com.br",
      passwordHash,
      phone: "(11) 98888-7777",
    },
  });
  console.log(`✅ Usuário criado: ${user.name} (${user.email})`);

  // 3. Cria Garagem Principal
  const garage = await prisma.garage.create({
    data: {
      name: "Alpha Motors Revenda",
      slug: "alpha-motors",
      documentCnpjCpf: "12.345.678/0001-90",
      phone: "(11) 3333-4444",
      email: "contato@alphamotors.com.br",
      city: "São Paulo",
      state: "SP",
    },
  });

  await prisma.garageMember.create({
    data: {
      garageId: garage.id,
      userId: user.id,
      role: GarageRole.OWNER,
    },
  });
  console.log(`✅ Garagem criada: ${garage.name} (Slug: ${garage.slug})`);

  // 4. Cria Cliente e Fornecedor
  const customer = await prisma.customer.create({
    data: {
      garageId: garage.id,
      name: "Carlos Eduardo Silva",
      documentCpfCnpj: "123.456.789-00",
      phone: "(11) 97777-6666",
      email: "carlos.silva@email.com",
      city: "São Paulo",
      state: "SP",
    },
  });

  const supplier = await prisma.supplier.create({
    data: {
      garageId: garage.id,
      tradeName: "Auto Peças & Oficina Central",
      contactPhone: "(11) 3222-1111",
      category: "MECANICA_AUTOPECAS",
    },
  });

  // 5. Veículo 1: Toyota Corolla 2022 (em PREPARAÇÃO com o exemplo exato do usuário)
  const corolla = await prisma.vehicle.create({
    data: {
      garageId: garage.id,
      plate: "BRA2E19",
      vin: "9BWZZZ377VT004251",
      renavam: "12345678901",
      brand: "Toyota",
      model: "Corolla",
      version: "XEi 2.0 Flex Aut.",
      yearManufacture: 2021,
      yearModel: 2022,
      color: "Prata",
      mileageIn: 45000,
      mileageCurrent: 45000,
      status: VehicleStatus.PREPARACAO, // 1ª Etapa
      acquisitionType: VehicleAcquisitionType.COMPRA_DIRETA_PF,
      acquisitionDate: new Date("2026-08-20"),
      acquisitionPrice: new Decimal(95000.00),
      fipeCode: "002167-9",
      fipePriceAtAcquisition: new Decimal(115820.00),
      fipeReferenceMonth: "agosto de 2026",
      targetSalePrice: new Decimal(112000.00),
      notes: "Carro em excelente estado, realizando revisão de freios e retoque estético.",
    },
  });

  // Lançamento 1 do Corolla: Troca de pastilhas (Peça: R$ 20 | Mão de Obra: R$ 50 = Total R$ 70)
  await prisma.vehicleExpense.create({
    data: {
      garageId: garage.id,
      vehicleId: corolla.id,
      category: ExpenseCategory.MANUTENCAO_MECANICA,
      description: "Troca de pastilhas de freio dianteiras",
      partsCost: new Decimal(20.00),
      laborCost: new Decimal(50.00),
      amount: new Decimal(70.00),
      expenseDate: new Date("2026-08-22"),
      supplierId: supplier.id,
      createdByUserId: user.id,
    },
  });

  // Lançamento 2 do Corolla: Pintura do parachoque (Peça: R$ 150 | Mão de Obra: R$ 450 = Total R$ 600)
  await prisma.vehicleExpense.create({
    data: {
      garageId: garage.id,
      vehicleId: corolla.id,
      category: ExpenseCategory.FUNILARIA_PINTURA,
      description: "Pintura e retoque do parachoque dianteiro",
      partsCost: new Decimal(150.00),
      laborCost: new Decimal(450.00),
      amount: new Decimal(600.00),
      expenseDate: new Date("2026-08-24"),
      createdByUserId: user.id,
    },
  });

  // Lançamento 3 do Corolla: Laudo Cautelar (Taxa: R$ 350)
  await prisma.vehicleExpense.create({
    data: {
      garageId: garage.id,
      vehicleId: corolla.id,
      category: ExpenseCategory.LAUDO_VISTORIA,
      description: "Laudo Cautelar 100% Aprovado (Dekra)",
      partsCost: new Decimal(0),
      laborCost: new Decimal(0),
      amount: new Decimal(350.00),
      expenseDate: new Date("2026-08-25"),
      createdByUserId: user.id,
    },
  });
  console.log(`✅ Veículo 1 criado: Corolla BRA2E19 em [PREPARACAO] (Custo: R$ 96.020,00)`);

  // 6. Veículo 2: Jeep Compass 2023 (em À VENDA)
  const compass = await prisma.vehicle.create({
    data: {
      garageId: garage.id,
      plate: "RIO2A18",
      vin: "9BWZZZ377VT009876",
      renavam: "98765432100",
      brand: "Jeep",
      model: "Compass",
      version: "Longitude 1.3 Turbo Flex Aut.",
      yearManufacture: 2022,
      yearModel: 2023,
      color: "Preto",
      mileageIn: 28000,
      mileageCurrent: 28000,
      status: VehicleStatus.A_VENDA, // 2ª Etapa
      acquisitionType: VehicleAcquisitionType.COMPRA_DIRETA_PJ,
      acquisitionDate: new Date("2026-08-10"),
      acquisitionPrice: new Decimal(130000.00),
      fipeCode: "017088-7",
      fipePriceAtAcquisition: new Decimal(152000.00),
      fipeReferenceMonth: "agosto de 2026",
      targetSalePrice: new Decimal(148000.00),
      minimumSalePrice: new Decimal(144000.00),
    },
  });

  await prisma.vehicleExpense.create({
    data: {
      garageId: garage.id,
      vehicleId: compass.id,
      category: ExpenseCategory.ESTETICA_HIGIENIZACAO,
      description: "Polimento técnico, vitrificação e higienização interna",
      partsCost: new Decimal(200.00),
      laborCost: new Decimal(600.00),
      amount: new Decimal(800.00),
      expenseDate: new Date("2026-08-12"),
      createdByUserId: user.id,
    },
  });
  console.log(`✅ Veículo 2 criado: Compass RIO2A18 em [A_VENDA] (Anunciado por R$ 148.000)`);

  // 7. Veículo 3: Chevrolet Onix 2020 (em VENDIDO)
  const onix = await prisma.vehicle.create({
    data: {
      garageId: garage.id,
      plate: "SPX1E22",
      vin: "9BWZZZ377VT001122",
      renavam: "11223344556",
      brand: "Chevrolet",
      model: "Onix",
      version: "LTZ 1.0 Turbo Aut.",
      yearManufacture: 2020,
      yearModel: 2020,
      color: "Branco",
      mileageIn: 52000,
      mileageCurrent: 52000,
      status: VehicleStatus.VENDIDO, // 3ª Etapa
      acquisitionType: VehicleAcquisitionType.COMPRA_DIRETA_PF,
      acquisitionDate: new Date("2026-08-01"),
      acquisitionPrice: new Decimal(58000.00),
      targetSalePrice: new Decimal(70000.00),
    },
  });

  await prisma.vehicleExpense.create({
    data: {
      garageId: garage.id,
      vehicleId: onix.id,
      category: ExpenseCategory.MANUTENCAO_MECANICA,
      description: "Troca de 2 pneus dianteiros e alinhamento",
      partsCost: new Decimal(800.00),
      laborCost: new Decimal(150.00),
      amount: new Decimal(950.00),
      expenseDate: new Date("2026-08-03"),
      createdByUserId: user.id,
    },
  });

  // Venda do Onix: Venda por R$ 68.000, Custo R$ 58.950 -> Lucro Bruto = R$ 9.050
  await prisma.saleTransaction.create({
    data: {
      garageId: garage.id,
      vehicleId: onix.id,
      customerId: customer.id,
      sellerUserId: user.id,
      saleDate: new Date("2026-08-15"),
      finalSalePrice: new Decimal(68000.00),
      paymentMethod: PaymentMethod.A_VISTA_PIX,
      cashAmount: new Decimal(68000.00),
      salesCommissionAmount: new Decimal(1000.00),
      taxAmount: new Decimal(300.00),
      totalAccumulatedCost: new Decimal(58950.00),
      grossProfit: new Decimal(9050.00),
      netProfit: new Decimal(7750.00),
      notes: "Venda quitada via PIX à vista.",
    },
  });
  console.log(`✅ Veículo 3 criado: Onix SPX1E22 em [VENDIDO] (Lucro Líquido: R$ 7.750,00)`);

  // 8. Despesas Gerais Fixas da Garagem
  await prisma.generalExpense.create({
    data: {
      garageId: garage.id,
      category: "ALUGUEL_CONDOMINIO",
      description: "Aluguel do Pátio e Loja",
      amount: new Decimal(4500.00),
      dueDate: new Date("2026-09-05"),
      isRecurring: true,
    },
  });

  await prisma.generalExpense.create({
    data: {
      garageId: garage.id,
      category: "MARKETING_ANUNCIOS",
      description: "Mensalidade Webmotors + iCarros",
      amount: new Decimal(2200.00),
      dueDate: new Date("2026-09-10"),
      isRecurring: true,
    },
  });
  console.log(`✅ Despesas Fixas da Garagem criadas (Aluguel e Webmotors)`);

  console.log("\n==========================================");
  console.log("🎉 SEED DO CARZ CONCLUÍDO COM SUCESSO!");
  console.log("==========================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

