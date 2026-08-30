import prisma from "../prisma";
import {
  CreateVehicleExpenseInput,
  CreateGeneralExpenseInput,
} from "../validations/expense.schema";
import Decimal from "decimal.js";

export class ExpenseService {
  /**
   * 1. Lança um gasto direto específico em um veículo (funilaria, mecânica, laudo, etc.)
   */
  static async createVehicleExpense(
    garageId: string,
    userId: string,
    input: CreateVehicleExpenseInput
  ) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: input.vehicleId, garageId },
    });

    if (!vehicle) {
      throw new Error("Veículo não encontrado nesta garagem.");
    }

    return prisma.vehicleExpense.create({
      data: {
        garageId,
        vehicleId: vehicle.id,
        category: input.category,
        description: input.description,
        amount: new Decimal(input.amount),
        expenseDate: new Date(input.expenseDate),
        paymentStatus: input.paymentStatus,
        supplierId: input.supplierId,
        receiptFileUrl: input.receiptFileUrl,
        createdByUserId: userId,
      },
    });
  }

  /**
   * 2. Lança uma despesa geral/fixa da garagem (aluguel, marketing, energia, etc.)
   */
  static async createGeneralExpense(
    garageId: string,
    input: CreateGeneralExpenseInput
  ) {
    return prisma.generalExpense.create({
      data: {
        garageId,
        category: input.category,
        description: input.description,
        amount: new Decimal(input.amount),
        dueDate: new Date(input.dueDate),
        paymentDate: input.paymentDate ? new Date(input.paymentDate) : null,
        paymentStatus: input.paymentStatus,
        isRecurring: input.isRecurring,
        recurrencePeriod: input.recurrencePeriod,
        supplierId: input.supplierId,
        documentNumber: input.documentNumber,
        notes: input.notes,
      },
    });
  }

  /**
   * 3. Lista as despesas gerais da garagem com filtros
   */
  static async listGeneralExpenses(garageId: string) {
    return prisma.generalExpense.findMany({
      where: { garageId },
      include: {
        supplier: true,
      },
      orderBy: { dueDate: "desc" },
    });
  }
}

