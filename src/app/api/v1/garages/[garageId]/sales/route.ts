import { NextRequest, NextResponse } from "next/server";
import { SaleService } from "@/lib/services/sale.service";
import { CreateSaleTransactionSchema } from "@/lib/validations/sale.schema";
import { authorizeGarageRequest, errorStatus, getRequestUserId } from "@/lib/authorization";
import { GarageRole } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.VENDEDOR);
    const sales = await SaleService.listSales(params.garageId);
    return NextResponse.json(sales);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao listar vendas" },
      { status: errorStatus(error) }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.VENDEDOR);
    const body = await request.json();
    const validatedData = CreateSaleTransactionSchema.parse(body);

    const sellerUserId = await getRequestUserId(request);

    const sale = await SaleService.createSale(
      params.garageId,
      sellerUserId,
      validatedData
    );

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao finalizar venda", details: error.errors },
      { status: errorStatus(error) }
    );
  }
}
