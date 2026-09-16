import { NextRequest, NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { authorizeGarageRequest, errorStatus } from "@/lib/authorization";
import { GarageRole } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    await authorizeGarageRequest(request, params.garageId, GarageRole.VIEWER);
    const month = new URL(request.url).searchParams.get("month");
    const referenceDate = month ? new Date(`${month}-01T12:00:00`) : new Date();
    if (Number.isNaN(referenceDate.getTime())) {
      return NextResponse.json({ error: "Mês inválido. Use AAAA-MM." }, { status: 400 });
    }
    const metrics = await DashboardService.getMetrics(params.garageId, referenceDate);
    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao obter métricas do dashboard" },
      { status: errorStatus(error) }
    );
  }
}
