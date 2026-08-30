import { NextRequest, NextResponse } from "next/server";
import { PartService } from "@/lib/services/part.service";
import { CreatePartSchema } from "@/lib/validations/part.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const parts = await PartService.listParts(params.garageId);
    return NextResponse.json(parts);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao listar peças" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { garageId: string } }
) {
  try {
    const body = await request.json();
    const validatedData = CreatePartSchema.parse(body);

    const part = await PartService.createPart(params.garageId, validatedData);
    return NextResponse.json(part, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao cadastrar peça", details: error.errors },
      { status: 400 }
    );
  }
}
