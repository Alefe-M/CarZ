import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/services/customer.service";
import { CreateCustomerSchema } from "@/lib/validations/customer.schema";
import { authorizeGarageRequest, errorStatus } from "@/lib/authorization";
import { GarageRole } from "@prisma/client";

export async function GET(request: NextRequest, { params }: { params: { garageId: string } }) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.VENDEDOR);
    return NextResponse.json(await CustomerService.listCustomers(params.garageId));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao listar clientes." }, { status: errorStatus(error) });
  }
}

export async function POST(request: NextRequest, { params }: { params: { garageId: string } }) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.VENDEDOR);
    const customer = await CustomerService.createCustomer(params.garageId, CreateCustomerSchema.parse(await request.json()));
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao cadastrar cliente.", details: error.errors }, { status: errorStatus(error) });
  }
}
