import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateGarageSchema } from "@/lib/validations/garage.schema";
import { GarageRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "00000000-0000-0000-0000-000000000001";

    const memberships = await prisma.garageMember.findMany({
      where: { userId },
      include: { garage: true },
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json(memberships);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao listar garagens" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateGarageSchema.parse(body);
    const userId = request.headers.get("x-user-id") || "00000000-0000-0000-0000-000000000001";

    // Cria a garagem e adiciona o criador como OWNER
    const garage = await prisma.$transaction(async (tx) => {
      const newGarage = await tx.garage.create({
        data: validatedData,
      });

      await tx.garageMember.create({
        data: {
          garageId: newGarage.id,
          userId,
          role: GarageRole.OWNER,
        },
      });

      return newGarage;
    });

    return NextResponse.json(garage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao criar garagem", details: error.errors },
      { status: 400 }
    );
  }
}
