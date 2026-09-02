"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGarage } from "@/context/GarageContext";
import {
  LayoutDashboard,
  Car,
  Receipt,
  BarChart3,
  Plus,
  Wrench,
  BadgeDollarSign,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onOpenExpenseModal?: () => void;
  onOpenSaleModal?: () => void;
}

export function MobileNav({ onOpenExpenseModal, onOpenSaleModal }: MobileNavProps) {
  const pathname = usePathname();
  const { garage } = useGarage();
  const [fabOpen, setFabOpen] = useState(false);

  const basePath = `/${garage.slug}`;

  const navItems = [
    { label: "Início", href: basePath, icon: LayoutDashboard, active: pathname === basePath },
    {
      label: "Veículos",
      href: `${basePath}/veiculos`,
      icon: Car,
      active: pathname.startsWith(`${basePath}/veiculos`),
    },
    {
      label: "Despesas",
      href: `${basePath}/despesas`,
      icon: Receipt,
      active: pathname.startsWith(`${basePath}/despesas`),
    },
    {
      label: "DRE",
      href: `${basePath}/relatorios`,
      icon: BarChart3,
      active: pathname.startsWith(`${basePath}/relatorios`),
    },
  ];

  return (
    <>
      {/* FAB Backdrop & Menu */}
      {fabOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setFabOpen(false)}
        >
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-11/12 max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md space-y-2 animate-in slide-in-from-bottom-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] font-semibold text-zinc-400 px-2 uppercase tracking-wider">
              Ações Rápidas
            </div>
            <Link
              href={`${basePath}/veiculos/novo`}
              onClick={() => setFabOpen(false)}
              className="flex items-center space-x-3 rounded-xl bg-zinc-800/80 p-3 text-xs font-semibold text-zinc-100 hover:bg-zinc-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Car className="h-4 w-4" />
              </div>
              <div>
                <div>Nova Entrada de Veículo</div>
                <div className="text-[10px] text-zinc-400 font-normal">Consulta FIPE e cálculo de deságio</div>
              </div>
            </Link>

            {onOpenExpenseModal && (
              <button
                onClick={() => {
                  setFabOpen(false);
                  onOpenExpenseModal();
                }}
                className="flex w-full items-center space-x-3 rounded-xl bg-zinc-800/80 p-3 text-left text-xs font-semibold text-zinc-100 hover:bg-zinc-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <div>Lançar Peça / Serviço no Carro</div>
                  <div className="text-[10px] text-zinc-400 font-normal">Discriminação de Peças x Mão de Obra</div>
                </div>
              </button>
            )}

            {onOpenSaleModal && (
              <button
                onClick={() => {
                  setFabOpen(false);
                  onOpenSaleModal();
                }}
                className="flex w-full items-center space-x-3 rounded-xl bg-zinc-800/80 p-3 text-left text-xs font-semibold text-zinc-100 hover:bg-zinc-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <BadgeDollarSign className="h-4 w-4" />
                </div>
                <div>
                  <div>Concluir Venda (com Trade-in)</div>
                  <div className="text-[10px] text-zinc-400 font-normal">Finalizar venda com veículo na troca</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-zinc-800 bg-zinc-950/95 px-2 backdrop-blur-xl md:hidden">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors",
                item.active ? "text-blue-400" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Center FAB Button */}
        <div className="relative -top-4 flex items-center justify-center">
          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-zinc-950 transition-transform active:scale-95"
          >
            {fabOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </button>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors",
                item.active ? "text-blue-400" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
