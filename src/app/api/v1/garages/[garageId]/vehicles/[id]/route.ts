import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/services/vehicle.service";
import { authorizeGarageRequest, errorStatus } from "@/lib/authorization";
import { GarageRole } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string; id: string } }
) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.MECANICO);
    const vehicle = await VehicleService.getVehicleById(
      params.garageId,
      params.id
    );
    return NextResponse.json(vehicle);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao consultar veículo" },
      { status: errorStatus(error) === 400 ? 404 : errorStatus(error) }
    );
  }
}
