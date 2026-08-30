import { NextRequest, NextResponse } from "next/server";
import { SaleService } from "@/lib/services/sale.service";
import { CreateSaleTransactionSchema } from "@/lib/validations/sale.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const sales = await SaleService.listSales(params.garageId);
    return NextResponse.json(sales);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao listar vendas" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const body = await request.json();
    const validatedData = CreateSaleTransactionSchema.parse(body);

    const sellerUserId = request.headers.get("x-user-id") || "00000000-0000-0000-0000-000000000001";

    const sale = await SaleService.createSale(
      params.garageId,
      sellerUserId,
      validatedData
    );

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao finalizar venda", details: error.errors },
      { status: 400 }
    );
  }
}
