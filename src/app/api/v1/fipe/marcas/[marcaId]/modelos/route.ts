import { NextRequest, NextResponse } from "next/server";
import { FipeService } from "@/lib/services/fipe.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { marcaId: string } }
) {
  try {
    const models = await FipeService.getModels(params.marcaId);
    return NextResponse.json(models);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao consultar modelos FIPE" },
      { status: 500 }
    );
  }
}
