"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGarage } from "@/context/GarageContext";
import { VehicleStatus } from "@prisma/client";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { SellVehicleModal } from "@/components/modals/SellVehicleModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, LayoutGrid, List, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function VehiclesPage() {
  const { garage, vehicles, updateVehicleStatus } = useGarage();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [activeVehicleId, setActiveVehicleId] = useState<string | undefined>(undefined);

  // Counts
  const prepCount = vehicles.filter((v) => v.status === "PREPARACAO").length;
  const forSaleCount = vehicles.filter((v) => v.status === "A_VENDA").length;
  const soldCount = vehicles.filter((v) => v.status === "VENDIDO").length;

  // Filtered List
  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus =
      statusFilter === "ALL" || v.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      v.plate.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      v.brand.toLowerCase().includes(query) ||
      v.vin.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleOpenExpense = (vehicleId: string) => {
    setActiveVehicleId(vehicleId);
    setExpenseModalOpen(true);
  };

  const handleOpenSale = (vehicleId: string) => {
    setActiveVehicleId(vehicleId);
    setSellModalOpen(true);
  };

  const handleAdvanceToForSale = (vehicleId: string) => {
    updateVehicleStatus(vehicleId, "A_VENDA", "Veículo liberado para venda.");
  };

  return (
    <div className="space-y-6">
      {/* Header & New Vehicle Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Estoque de Veículos
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie veículos pelas 3 etapas de ciclo de vida com dossiê financeiro integrado.
          </p>
        </div>

        <Link href={`/${garage.slug}/veiculos/novo`}>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nova Entrada (FIPE)</span>
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "ALL"
                ? "bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Todos ({vehicles.length})
          </button>
          <button
            onClick={() => setStatusFilter("PREPARACAO")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              statusFilter === "PREPARACAO"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>🟡 Preparação</span>
            <span className="bg-amber-500/20 px-1.5 py-0.2 rounded-full text-[10px]">
              {prepCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("A_VENDA")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              statusFilter === "A_VENDA"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>🟢 À Venda</span>
            <span className="bg-emerald-500/20 px-1.5 py-0.2 rounded-full text-[10px]">
              {forSaleCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("VENDIDO")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              statusFilter === "VENDIDO"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>🟣 Vendidos</span>
            <span className="bg-purple-500/20 px-1.5 py-0.2 rounded-full text-[10px]">
              {soldCount}
            </span>
          </button>
        </div>

        {/* Search Input & View Toggle */}
        <div className="flex items-center gap-2">
          <div className="w-full md:w-64">
            <Input
              placeholder="Buscar placa, modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-3.5 w-3.5 text-zinc-400" />}
              className="h-8 text-xs bg-zinc-950/80"
            />
          </div>

          <div className="flex items-center rounded-lg bg-zinc-950 p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid or Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 text-sm">
              Nenhum veículo encontrado com os filtros selecionados.
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onOpenExpenseModal={handleOpenExpense}
                onOpenSaleModal={handleOpenSale}
                onAdvanceStatus={handleAdvanceToForSale}
              />
            ))
          )}
        </div>
      ) : (
        <VehicleTable
          vehicles={filteredVehicles}
          onOpenExpenseModal={handleOpenExpense}
          onOpenSaleModal={handleOpenSale}
        />
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        defaultVehicleId={activeVehicleId}
      />

      <SellVehicleModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        defaultVehicleId={activeVehicleId}
      />
    </div>
  );
}
