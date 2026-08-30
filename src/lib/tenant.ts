import prisma from "./prisma";
import { GarageRole } from "@prisma/client";

export const ROLE_HIERARCHY: Record<GarageRole, number> = {
  OWNER: 100,
  ADMIN: 80,
  GERENTE: 60,
  VENDEDOR: 40,
  MECANICO: 30,
  ESTOQUISTA: 30,
  VIEWER: 10,
};

export interface TenantContext {
  userId: string;
  garageId: string;
  role: GarageRole;
}

/**
 * Valida se um usuário pertence a uma garagem e se possui o nível de permissão mínimo exigido.
 */
export async function verifyGarageAccess(
  garageId: string,
  userId: string,
  minRole?: GarageRole
): Promise<TenantContext> {
  if (!garageId || !userId) {
    throw new Error("Identificador de Garagem ou Usuário não fornecido.");
  }

  const membership = await prisma.garageMember.findUnique({
    where: {
      garageId_userId: {
        garageId,
        userId,
      },
    },
    include: {
      garage: true,
    },
  });

  if (!membership) {
    throw new Error("Acesso negado: Você não é membro desta garagem.");
  }

  if (minRole) {
    const userRoleWeight = ROLE_HIERARCHY[membership.role] || 0;
    const requiredRoleWeight = ROLE_HIERARCHY[minRole] || 0;

    if (userRoleWeight < requiredRoleWeight) {
      throw new Error(
        `Permissão insuficiente. Nível necessário: ${minRole}, Seu nível: ${membership.role}`
      );
    }
  }

  return {
    userId,
    garageId,
    role: membership.role,
  };
}

/**
 * Retorna todas as garagens às quais um usuário tem acesso.
 */
export async function getUserGarages(userId: string) {
  return prisma.garageMember.findMany({
    where: { userId },
    include: {
      garage: true,
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
}

