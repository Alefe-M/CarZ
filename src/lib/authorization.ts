import { GarageRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { verifyGarageAccess } from "./tenant";
import jwt from "jsonwebtoken";

/**
 * Resolves the identity supplied by the authentication layer.
 *
 * Route handlers deliberately do not fall back to a fixed user: doing so would
 * let an unauthenticated request read or mutate a tenant's data. An upstream
 * Auth.js/JWT integration can populate this header after verifying the token.
 */
export async function getRequestUserId(request: NextRequest): Promise<string> {
  const token = request.cookies.get("carz_session")?.value;
  const secret = process.env.NEXTAUTH_SECRET;
  if (!token || !secret) throw new Error("Não autenticado.");

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    if (!payload.sub) throw new Error("Sessão inválida.");
    return payload.sub;
  } catch {
    throw new Error("Não autenticado.");
  }
}

export async function authorizeGarageRequest(
  request: NextRequest,
  garageId: string,
  minRole?: GarageRole
) {
  return verifyGarageAccess(garageId, await getRequestUserId(request), minRole);
}

export function errorStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : "";
  if (message === "Não autenticado.") return 401;
  if (message.startsWith("Acesso negado") || message.startsWith("Permissão insuficiente")) return 403;
  return 400;
}
