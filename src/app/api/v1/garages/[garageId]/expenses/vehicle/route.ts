import { NextRequest, NextResponse } from "next/server";
import { ExpenseService } from "@/lib/services/expense.service";
import { CreateVehicleExpenseSchema } from "@/lib/validations/expense.schema";

export async function POST(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const body = await request.json();
    const validatedData = CreateVehicleExpenseSchema.parse(body);

    const userId = request.headers.get("x-user-id") || "00000000-0000-0000-0000-000000000001";

    const expense = await ExpenseService.createVehicleExpense(
      params.garageId,
      userId,
      validatedData
    );

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao lançar despesa no veículo", details: error.errors },
      { status: 400 }
    );
  }
}
