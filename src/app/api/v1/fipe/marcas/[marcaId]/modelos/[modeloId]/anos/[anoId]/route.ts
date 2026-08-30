import { NextRequest, NextResponse } from "next/server";
import { FipeService } from "@/lib/services/fipe.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { marcaId: string; modeloId: string; anoId: string } }
) {
  try {
    const valuation = await FipeService.getValuation(
      params.marcaId,
      params.modeloId,
      params.anoId
    );
    return NextResponse.json(valuation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao consultar avaliação FIPE" },
      { status: 500 }
    );
  }
}
