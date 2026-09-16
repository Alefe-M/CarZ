import { VehicleStatus } from "@prisma/client";

const ALLOWED_TRANSITIONS: Record<VehicleStatus, VehicleStatus[]> = {
  PREPARACAO: [VehicleStatus.A_VENDA],
  A_VENDA: [VehicleStatus.PREPARACAO],
  // A sale is the only operation allowed to move a vehicle to VENDIDO.
  VENDIDO: [],
};

export function assertVehicleStatusTransition(
  currentStatus: VehicleStatus,
  nextStatus: VehicleStatus
) {
  if (nextStatus === VehicleStatus.VENDIDO) {
    throw new Error("Use a finalização de venda para marcar o veículo como vendido.");
  }

  if (!ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)) {
    throw new Error(`Transição inválida: ${currentStatus} -> ${nextStatus}.`);
  }
}
