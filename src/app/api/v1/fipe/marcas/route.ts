import { NextResponse } from "next/server";
import { FipeService } from "@/lib/services/fipe.service";

// FIPE is an external, cached runtime dependency; never contact it while building.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brands = await FipeService.getBrands();
    return NextResponse.json(brands);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao consultar marcas FIPE" },
      { status: 500 }
    );
  }
}
