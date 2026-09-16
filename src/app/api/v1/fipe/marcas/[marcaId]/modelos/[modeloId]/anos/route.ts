import { NextRequest, NextResponse } from "next/server";
import { FipeService } from "@/lib/services/fipe.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { marcaId: string; modeloId: string } }
) {
  try {
    const years = await FipeService.getYears(params.marcaId, params.modeloId);
    return NextResponse.json(years);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao consultar anos FIPE" },
      { status: 500 }
    );
  }
}
