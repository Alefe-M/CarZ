"use client";

import React from "react";
import Link from "next/link";
import { VehicleItem, useGarage } from "@/context/GarageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPlate } from "@/lib/utils";
import { ArrowRight, Wrench, BadgeDollarSign } from "lucide-react";

interface VehicleTableProps {
  vehicles: VehicleItem[];
  onOpenExpenseModal: (vehicleId: string) => void;
  onOpenSaleModal: (vehicleId: string) => void;
}

export function VehicleTable({
  vehicles,
  onOpenExpenseModal,
  onOpenSaleModal,
}: VehicleTableProps) {
  const { garage } = useGarage();

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
      <table className="w-full text-left text-xs text-zinc-300">
        <thead className="border-b border-zinc-800 bg-zinc-950/60 uppercase text-[10px] font-semibold text-zinc-400 tracking-wider">
          <tr>
            <th className="px-4 py-3">Placa / Modelo</th>
            <th className="px-4 py-3">Etapa</th>
            <th className="px-4 py-3">Preço Compra</th>
            <th className="px-4 py-3">Peças</th>
            <th className="px-4 py-3">Mão de Obra</th>
            <th className="px-4 py-3">Custo Acumulado</th>
            <th className="px-4 py-3">Preço Venda</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                Nenhum veículo encontrado
              </td>
            </tr>
          ) : (
            vehicles.map((v) => (
              <tr
                key={v.id}
                className="hover:bg-zinc-800/40 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono font-bold text-zinc-100 text-[11px] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {formatPlate(v.plate)}
                    </span>
                    <div>
                      <div className="font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {v.version} • {v.yearModel}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {v.status === "PREPARACAO" && (
                    <Badge variant="preparacao">🟡 Preparação</Badge>
                  )}
                  {v.status === "A_VENDA" && (
                    <Badge variant="a_venda">🟢 À Venda</Badge>
                  )}
                  {v.status === "VENDIDO" && (
                    <Badge variant="vendido">🟣 Vendido</Badge>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-300">
                  {formatCurrency(v.acquisitionPrice)}
                </td>
                <td className="px-4 py-3 font-medium text-cyan-400">
                  {formatCurrency(v.totalPartsCost)}
                </td>
                <td className="px-4 py-3 font-medium text-violet-400">
                  {formatCurrency(v.totalLaborCost)}
                </td>
                <td className="px-4 py-3 font-bold text-amber-400">
                  {formatCurrency(v.totalAccumulatedCost)}
                </td>
                <td className="px-4 py-3 font-bold text-emerald-400">
                  {v.targetSalePrice ? formatCurrency(v.targetSalePrice) : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    {v.status === "PREPARACAO" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenExpenseModal(v.id)}
                        className="h-7 px-2 text-[10px] border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Wrench className="h-3 w-3 mr-1" />
                        Gasto
                      </Button>
                    )}
                    {v.status === "A_VENDA" && (
                      <Button
                        size="sm"
                        variant="emerald"
                        onClick={() => onOpenSaleModal(v.id)}
                        className="h-7 px-2 text-[10px]"
                      >
                        <BadgeDollarSign className="h-3 w-3 mr-1" />
                        Vender
                      </Button>
                    )}
                    <Link href={`/${garage.slug}/veiculos/${v.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]">
                        <span>Dossiê</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
