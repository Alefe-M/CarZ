-- CreateEnum
CREATE TYPE "GarageRole" AS ENUM ('OWNER', 'ADMIN', 'GERENTE', 'VENDEDOR', 'MECANICO', 'VIEWER');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDENTE', 'ACEITO', 'RECUSADO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('PREPARACAO', 'A_VENDA', 'VENDIDO');

-- CreateEnum
CREATE TYPE "VehicleAcquisitionType" AS ENUM ('COMPRA_DIRETA_PF', 'COMPRA_DIRETA_PJ', 'LEILAO', 'TROCA_TRADE_IN', 'CONSIGNADO');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('FLEX', 'GASOLINA', 'ETANOL', 'DIESEL', 'HIBRIDO', 'ELETRICO', 'GNV');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('MANUAL', 'AUTOMATICO', 'AUTOMATIZADO', 'CVT');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('MANUTENCAO_MECANICA', 'FUNILARIA_PINTURA', 'ESTETICA_HIGIENIZACAO', 'DOCUMENTACAO_TAXAS', 'LAUDO_VISTORIA', 'TRANSPORTE_GUINCHO', 'OUTRO_DIRETO');

-- CreateEnum
CREATE TYPE "GeneralExpenseCategory" AS ENUM ('ALUGUEL_CONDOMINIO', 'ENERGIA_AGUA_INTERNET', 'MARKETING_ANUNCIOS', 'SALARIOS_PRO_LABORE', 'COMISSOES_GERAIS', 'FERRAMENTAS_EQUIPAMENTOS', 'SOFTWARES_SISTEMAS', 'IMPOSTOS_TAXAS_EMPRESARIAIS', 'CONTABILIDADE_JURIDICO', 'MANUTENCAO_PREDIO_LOJA', 'OUTRO_GERAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('A_VISTA_PIX', 'A_VISTA_TED', 'FINANCIAMENTO', 'CARTAO_CREDITO', 'CARTA_CONSORCIO', 'VEICULO_TROCA', 'MISTO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO', 'REEMBOLSADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "documentCnpjCpf" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" VARCHAR(2),
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garage_members" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "GarageRole" NOT NULL DEFAULT 'VENDEDOR',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "garage_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garage_invites" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "GarageRole" NOT NULL DEFAULT 'VENDEDOR',
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDENTE',
    "invitedByUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "garage_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentCpfCnpj" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" VARCHAR(2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "legalName" TEXT,
    "documentCnpjCpf" TEXT,
    "contactPhone" TEXT NOT NULL,
    "email" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "plate" VARCHAR(7) NOT NULL,
    "vin" VARCHAR(17) NOT NULL,
    "renavam" VARCHAR(11) NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "version" TEXT,
    "yearManufacture" INTEGER NOT NULL,
    "yearModel" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "fuelType" "FuelType" NOT NULL DEFAULT 'FLEX',
    "transmission" "TransmissionType" NOT NULL DEFAULT 'MANUAL',
    "mileageIn" INTEGER NOT NULL,
    "mileageCurrent" INTEGER NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'PREPARACAO',
    "acquisitionType" "VehicleAcquisitionType" NOT NULL DEFAULT 'COMPRA_DIRETA_PF',
    "acquisitionDate" DATE NOT NULL,
    "acquisitionPrice" DECIMAL(12,2) NOT NULL,
    "fipeCode" VARCHAR(10),
    "fipePriceAtAcquisition" DECIMAL(12,2),
    "fipeReferenceMonth" VARCHAR(30),
    "targetSalePrice" DECIMAL(12,2),
    "minimumSalePrice" DECIMAL(12,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierId" TEXT,
    "tradeInFromSaleId" TEXT,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_expenses" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "partsCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "laborCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "amount" DECIMAL(12,2) NOT NULL,
    "expenseDate" DATE NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PAGO',
    "receiptFileUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplierId" TEXT,
    "createdByUserId" TEXT NOT NULL,

    CONSTRAINT "vehicle_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_expenses" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "category" "GeneralExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" DATE NOT NULL,
    "paymentDate" DATE,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrencePeriod" TEXT,
    "documentNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplierId" TEXT,

    CONSTRAINT "general_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_transactions" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sellerUserId" TEXT NOT NULL,
    "saleDate" DATE NOT NULL,
    "finalSalePrice" DECIMAL(12,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "cashAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "financedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "salesCommissionAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tradeInValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAccumulatedCost" DECIMAL(12,2) NOT NULL,
    "grossProfit" DECIMAL(12,2) NOT NULL,
    "netProfit" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "garages_slug_key" ON "garages"("slug");

-- CreateIndex
CREATE INDEX "garage_members_userId_idx" ON "garage_members"("userId");

-- CreateIndex
CREATE INDEX "garage_members_garageId_idx" ON "garage_members"("garageId");

-- CreateIndex
CREATE UNIQUE INDEX "garage_members_garageId_userId_key" ON "garage_members"("garageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "garage_invites_token_key" ON "garage_invites"("token");

-- CreateIndex
CREATE INDEX "garage_invites_garageId_idx" ON "garage_invites"("garageId");

-- CreateIndex
CREATE INDEX "garage_invites_email_idx" ON "garage_invites"("email");

-- CreateIndex
CREATE INDEX "customers_garageId_idx" ON "customers"("garageId");

-- CreateIndex
CREATE UNIQUE INDEX "customers_garageId_documentCpfCnpj_key" ON "customers"("garageId", "documentCpfCnpj");

-- CreateIndex
CREATE INDEX "suppliers_garageId_idx" ON "suppliers"("garageId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_tradeInFromSaleId_key" ON "vehicles"("tradeInFromSaleId");

-- CreateIndex
CREATE INDEX "vehicles_garageId_status_idx" ON "vehicles"("garageId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_garageId_plate_key" ON "vehicles"("garageId", "plate");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_garageId_vin_key" ON "vehicles"("garageId", "vin");

-- CreateIndex
CREATE INDEX "vehicle_expenses_garageId_idx" ON "vehicle_expenses"("garageId");

-- CreateIndex
CREATE INDEX "vehicle_expenses_vehicleId_idx" ON "vehicle_expenses"("vehicleId");

-- CreateIndex
CREATE INDEX "general_expenses_garageId_idx" ON "general_expenses"("garageId");

-- CreateIndex
CREATE UNIQUE INDEX "sale_transactions_vehicleId_key" ON "sale_transactions"("vehicleId");

-- CreateIndex
CREATE INDEX "sale_transactions_garageId_idx" ON "sale_transactions"("garageId");

-- AddForeignKey
ALTER TABLE "garage_members" ADD CONSTRAINT "garage_members_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garage_members" ADD CONSTRAINT "garage_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garage_invites" ADD CONSTRAINT "garage_invites_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garage_invites" ADD CONSTRAINT "garage_invites_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_tradeInFromSaleId_fkey" FOREIGN KEY ("tradeInFromSaleId") REFERENCES "sale_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "general_expenses" ADD CONSTRAINT "general_expenses_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "general_expenses" ADD CONSTRAINT "general_expenses_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_transactions" ADD CONSTRAINT "sale_transactions_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_transactions" ADD CONSTRAINT "sale_transactions_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_transactions" ADD CONSTRAINT "sale_transactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_transactions" ADD CONSTRAINT "sale_transactions_sellerUserId_fkey" FOREIGN KEY ("sellerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
