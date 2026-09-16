import { NextRequest, NextResponse } from "next/server";
import { ExpenseService } from "@/lib/services/expense.service";
import { CreateVehicleExpenseSchema } from "@/lib/validations/expense.schema";
import { authorizeGarageRequest, errorStatus, getRequestUserId } from "@/lib/authorization";
import { GarageRole } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.MECANICO);
    const body = await request.json();
    const validatedData = CreateVehicleExpenseSchema.parse(body);

    const userId = await getRequestUserId(request);

    const expense = await ExpenseService.createVehicleExpense(
      params.garageId,
      userId,
      validatedData
    );

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao lançar despesa no veículo", details: error.errors },
      { status: errorStatus(error) }
    );
  }
}
