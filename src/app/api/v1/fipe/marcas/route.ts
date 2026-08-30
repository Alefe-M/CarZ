import { NextResponse } from "next/server";
import { FipeService } from "@/lib/services/fipe.service";

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
