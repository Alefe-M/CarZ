import { NextRequest, NextResponse } from "next/server";
import { PartService } from "@/lib/services/part.service";
import { CreateStockMovementSchema } from "@/lib/validations/part.schema";

export async function POST(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const body = await request.json();
    const validatedData = CreateStockMovementSchema.parse(body);

    // Mock/Auth context: utiliza o ID do usuário fornecido no header ou mock para testes
    const userId = request.headers.get("x-user-id") || "00000000-0000-0000-0000-000000000001";

    const movement = await PartService.recordStockMovement(
      params.garageId,
      userId,
      validatedData
    );

    return NextResponse.json(movement, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao registrar movimentação", details: error.errors },
      { status: 400 }
    );
  }
}
