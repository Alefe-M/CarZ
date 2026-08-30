import { NextRequest, NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const metrics = await DashboardService.getMetrics(params.garageId);
    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao obter métricas do dashboard" },
      { status: 500 }
    );
  }
}
