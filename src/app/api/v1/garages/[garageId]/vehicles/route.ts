import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/services/vehicle.service";
import { CreateVehicleSchema } from "@/lib/validations/vehicle.schema";
import { VehicleStatus } from "@prisma/client";
import { authorizeGarageRequest, errorStatus } from "@/lib/authorization";
import { GarageRole } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.MECANICO);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as VehicleStatus | null;
    const search = searchParams.get("search") || undefined;

    const vehicles = await VehicleService.listVehicles(params.garageId, {
      status: status || undefined,
      search,
    });

    return NextResponse.json(vehicles);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao listar veículos" },
      { status: errorStatus(error) }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.GERENTE);
    const body = await request.json();
    const validatedData = CreateVehicleSchema.parse(body);

    const vehicle = await VehicleService.createVehicle(
      params.garageId,
      validatedData
    );

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao cadastrar veículo", details: error.errors },
      { status: errorStatus(error) }
    );
  }
}
