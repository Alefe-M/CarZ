"use client";

import React from "react";
import Link from "next/link";
import { VehicleItem, useGarage } from "@/context/GarageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPlate } from "@/lib/utils";
import {
  Wrench,
  BadgeDollarSign,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: VehicleItem;
  onOpenExpenseModal?: (vehicleId: string) => void;
  onOpenSaleModal?: (vehicleId: string) => void;
  onAdvanceStatus?: (vehicleId: string) => void;
}

export function VehicleCard({
  vehicle,
  onOpenExpenseModal,
  onOpenSaleModal,
  onAdvanceStatus,
}: VehicleCardProps) {
  const { garage } = useGarage();

  const isPrep = vehicle.status === "PREPARACAO";
  const isForSale = vehicle.status === "A_VENDA";
  const isSold = vehicle.status === "VENDIDO";

  // Deságio FIPE
  const fipeDiff =
    vehicle.fipePriceAtAcquisition && vehicle.fipePriceAtAcquisition > 0
      ? ((vehicle.fipePriceAtAcquisition - vehicle.acquisitionPrice) /
          vehicle.fipePriceAtAcquisition) *
        100
      : 0;

  // Potential Gross Profit for "A_VENDA"
  const potentialProfit =
    (vehicle.targetSalePrice || 0) - vehicle.totalAccumulatedCost;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-sm hover:border-zinc-700/90 hover:bg-zinc-900/90 transition-all duration-200">
      {/* Top Header: Plate Pill & Stage Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Brazilian Plate Pill */}
          <div className="inline-flex items-center rounded-md border border-zinc-700/80 bg-zinc-950 px-2 py-0.5 text-[11px] font-mono font-bold tracking-wider text-zinc-100 shadow-xs">
            <span className="text-[9px] text-blue-400 mr-1.5 font-sans font-bold">BR</span>
            {formatPlate(vehicle.plate)}
          </div>

          {/* Status Badge */}
          {isPrep && (
            <Badge variant="preparacao">
              🟡 Preparação
            </Badge>
          )}
          {isForSale && (
            <Badge variant="a_venda">
              🟢 À Venda
            </Badge>
          )}
          {isSold && (
            <Badge variant="vendido">
              🟣 Vendido
            </Badge>
          )}
        </div>

        {/* Vehicle Title & Details */}
        <Link
          href={`/${garage.slug}/veiculos/${vehicle.id}`}
          className="block group-hover:text-blue-400 transition-colors"
        >
          <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1">
            {vehicle.brand} {vehicle.model}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1">
            {vehicle.version} • {vehicle.yearModel} • {vehicle.color}
          </p>
        </Link>

        {/* Stage-Specific Financial Badges */}
        <div className="mt-3.5 space-y-2">
          {isPrep && (
            <div className="rounded-lg bg-zinc-950/70 p-2.5 border border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">Custo Acumulado:</span>
                <span className="font-bold text-amber-400">
                  {formatCurrency(vehicle.totalAccumulatedCost)}
                </span>
              </div>

              {/* Discrimination: Peças vs Mão de Obra */}
              <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                <span className="rounded bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 border border-cyan-500/20 font-medium">
                  Peças: {formatCurrency(vehicle.totalPartsCost)}
                </span>
                <span className="rounded bg-violet-500/10 text-violet-400 px-1.5 py-0.5 border border-violet-500/20 font-medium">
                  Serviços: {formatCurrency(vehicle.totalLaborCost)}
                </span>
              </div>

              <div className="mt-1.5 flex items-center text-[10px] text-zinc-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{vehicle.expenses.length} manutenções registradas</span>
              </div>
            </div>
          )}

          {isForSale && (
            <div className="rounded-lg bg-zinc-950/70 p-2.5 border border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">Preço Anunciado:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {formatCurrency(vehicle.targetSalePrice)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 text-[10px]">Margem Projetada:</span>
                <span className="font-semibold text-zinc-200">
                  {formatCurrency(potentialProfit)}
                </span>
              </div>

              {fipeDiff !== 0 && (
                <div className="mt-1.5">
                  <span className="inline-block rounded bg-blue-500/10 text-blue-400 px-1.5 py-0.5 text-[10px] border border-blue-500/20 font-semibold">
                    {fipeDiff > 0 ? `-${fipeDiff.toFixed(1)}% FIPE` : `+${Math.abs(fipeDiff).toFixed(1)}% FIPE`}
                  </span>
                </div>
              )}
            </div>
          )}

          {isSold && (
            <div className="rounded-lg bg-zinc-950/70 p-2.5 border border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">Custo Total:</span>
                <span className="font-semibold text-zinc-300">
                  {formatCurrency(vehicle.totalAccumulatedCost)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs border-t border-zinc-800/80 pt-1.5">
                <span className="text-zinc-400 text-[11px]">Status Comercial:</span>
                <span className="font-bold text-purple-400">
                  Venda Concluída
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-1.5">
        <Link
          href={`/${garage.slug}/veiculos/${vehicle.id}`}
          className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 group/link transition-colors"
        >
          <span>Dossiê</span>
          <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>

        <div className="flex items-center space-x-1.5">
          {isPrep && onOpenExpenseModal && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenExpenseModal(vehicle.id)}
              className="h-7 text-[11px] px-2 gap-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <Wrench className="h-3 w-3" />
              <span>Gasto</span>
            </Button>
          )}

          {isPrep && onAdvanceStatus && (
            <Button
              size="sm"
              variant="emerald"
              onClick={() => onAdvanceStatus(vehicle.id)}
              className="h-7 text-[11px] px-2 gap-1"
            >
              <span>À Venda</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}

          {isForSale && onOpenSaleModal && (
            <Button
              size="sm"
              variant="emerald"
              onClick={() => onOpenSaleModal(vehicle.id)}
              className="h-7 text-[11px] px-2.5 gap-1 shadow-sm font-semibold"
            >
              <BadgeDollarSign className="h-3 w-3" />
              <span>Vender</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
