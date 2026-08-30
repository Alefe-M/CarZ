import { NextRequest, NextResponse } from "next/server";
import { VehicleService } from "@/lib/services/vehicle.service";
import { UpdateVehicleStatusSchema } from "@/lib/validations/vehicle.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { garageId: string; id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = UpdateVehicleStatusSchema.parse(body);

    const vehicle = await VehicleService.updateVehicleStatus(
      params.garageId,
      params.id,
      validatedData.status,
      validatedData.notes
    );

    return NextResponse.json(vehicle);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar status do veículo", details: error.errors },
      { status: 400 }
    );
  }
}
