import { NextRequest, NextResponse } from "next/server";
import { ExpenseService } from "@/lib/services/expense.service";
import { CreateGeneralExpenseSchema } from "@/lib/validations/expense.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const expenses = await ExpenseService.listGeneralExpenses(params.garageId);
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao listar despesas gerais" },
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
    const validatedData = CreateGeneralExpenseSchema.parse(body);

    const expense = await ExpenseService.createGeneralExpense(
      params.garageId,
      validatedData
    );

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao cadastrar despesa geral", details: error.errors },
      { status: 400 }
    );
  }
}
