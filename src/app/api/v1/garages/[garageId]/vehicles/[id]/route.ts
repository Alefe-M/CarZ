import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/services/vehicle.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string; id: string } }
) {
  try {
    const vehicle = await VehicleService.getVehicleById(
      params.garageId,
      params.id
    );
    return NextResponse.json(vehicle);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao consultar veículo" },
      { status: 404 }
    );
  }
}
