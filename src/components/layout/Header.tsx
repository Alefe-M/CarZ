"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGarage } from "@/context/GarageContext";
import { Search, Plus, Sparkles, Bell, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onOpenNewVehicle?: () => void;
  onOpenExpenseModal?: () => void;
  onOpenSaleModal?: () => void;
}

export function Header({ onOpenNewVehicle, onOpenExpenseModal, onOpenSaleModal }: HeaderProps) {
  const { garage } = useGarage();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 md:px-6 backdrop-blur-xl">
      {/* Search Input */}
      <div className="flex items-center space-x-3 w-full max-w-md">
        <div className="relative w-full">
          <Input
            placeholder="Buscar por Placa (ex: BRA2E19), Chassi ou Modelo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-zinc-400" />}
            className="h-9 bg-zinc-900/80 border-zinc-800 text-xs focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center space-x-2.5">
        <Link href={`/${garage.slug}/veiculos/novo`}>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-900/40 text-xs font-semibold gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nova Entrada (FIPE)</span>
            <span className="sm:hidden">Entrada</span>
          </Button>
        </Link>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
}
