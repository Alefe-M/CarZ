"use client";

import React from "react";
import { VehicleItem, useGarage } from "@/context/GarageContext";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { formatCurrency } from "@/lib/utils";
import { Wrench, Tag, CheckCircle2 } from "lucide-react";

interface PipelineKanbanProps {
  onOpenExpenseModal: (vehicleId: string) => void;
  onOpenSaleModal: (vehicleId: string) => void;
}

export function PipelineKanban({
  onOpenExpenseModal,
  onOpenSaleModal,
}: PipelineKanbanProps) {
  const { vehicles, updateVehicleStatus } = useGarage();

  const prepVehicles = vehicles.filter((v) => v.status === "PREPARACAO");
  const forSaleVehicles = vehicles.filter((v) => v.status === "A_VENDA");
  const soldVehicles = vehicles.filter((v) => v.status === "VENDIDO");

  const prepTotal = prepVehicles.reduce((acc, v) => acc + v.totalAccumulatedCost, 0);
  const forSaleTotal = forSaleVehicles.reduce(
    (acc, v) => acc + (v.targetSalePrice || v.totalAccumulatedCost),
    0
  );
  const soldTotal = soldVehicles.reduce((acc, v) => acc + v.totalAccumulatedCost, 0);

  const handleAdvanceToForSale = (vehicleId: string) => {
    updateVehicleStatus(vehicleId, "A_VENDA", "Veículo revisado e liberado para venda.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Column 1: PREPARAÇÃO */}
      <div className="flex flex-col rounded-2xl border border-amber-500/20 bg-amber-950/10 p-3.5 backdrop-blur-xs">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3 px-1">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Wrench className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                1. Preparação
              </span>
              <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300">
                {prepVehicles.length}
              </span>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-amber-400/90">
            {formatCurrency(prepTotal)}
          </div>
        </div>

        {/* Column Cards */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
          {prepVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 text-xs">
              Nenhum veículo em preparação
            </div>
          ) : (
            prepVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onOpenExpenseModal={onOpenExpenseModal}
                onAdvanceStatus={handleAdvanceToForSale}
              />
            ))
          )}
        </div>
      </div>

      {/* Column 2: À VENDA */}
      <div className="flex flex-col rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-3.5 backdrop-blur-xs">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3 px-1">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Tag className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                2. À Venda
              </span>
              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                {forSaleVehicles.length}
              </span>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-emerald-400/90">
            {formatCurrency(forSaleTotal)}
          </div>
        </div>

        {/* Column Cards */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
          {forSaleVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 text-xs">
              Nenhum veículo anunciado à venda
            </div>
          ) : (
            forSaleVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onOpenSaleModal={onOpenSaleModal}
              />
            ))
          )}
        </div>
      </div>

      {/* Column 3: VENDIDO */}
      <div className="flex flex-col rounded-2xl border border-purple-500/20 bg-purple-950/10 p-3.5 backdrop-blur-xs">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-3 px-1">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                3. Vendidos
              </span>
              <span className="ml-2 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold text-purple-300">
                {soldVehicles.length}
              </span>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-purple-400/90">
            {formatCurrency(soldTotal)}
          </div>
        </div>

        {/* Column Cards */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
          {soldVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 text-xs">
              Nenhuma venda registrada ainda
            </div>
          ) : (
            soldVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
