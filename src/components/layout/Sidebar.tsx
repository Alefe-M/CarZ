"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGarage } from "@/context/GarageContext";
import { GarageSwitcher } from "@/components/tenant/GarageSwitcher";
import {
  LayoutDashboard,
  Car,
  Receipt,
  BadgeDollarSign,
  BarChart3,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { garage, vehicles } = useGarage();

  const prepCount = vehicles.filter((v) => v.status === "PREPARACAO").length;
  const forSaleCount = vehicles.filter((v) => v.status === "A_VENDA").length;
  const soldCount = vehicles.filter((v) => v.status === "VENDIDO").length;

  const basePath = `/${garage.slug}`;

  const navItems = [
    {
      label: "Dashboard",
      href: basePath,
      icon: LayoutDashboard,
      active: pathname === basePath,
    },
    {
      label: "Estoque de Veículos",
      href: `${basePath}/veiculos`,
      icon: Car,
      active: pathname.startsWith(`${basePath}/veiculos`),
      stages: [
        { label: "Prep", count: prepCount, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
        { label: "Venda", count: forSaleCount, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
        { label: "Vend", count: soldCount, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
      ],
    },
    {
      label: "Despesas Gerais",
      href: `${basePath}/despesas`,
      icon: Receipt,
      active: pathname.startsWith(`${basePath}/despesas`),
    },
    {
      label: "Vendas & Trade-in",
      href: `${basePath}/vendas`,
      icon: BadgeDollarSign,
      active: pathname.startsWith(`${basePath}/vendas`),
    },
    {
      label: "Relatórios DRE",
      href: `${basePath}/relatorios`,
      icon: BarChart3,
      active: pathname.startsWith(`${basePath}/relatorios`),
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 border-r border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl h-screen sticky top-0 z-40 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-4 pb-2 border-b border-zinc-800/60">
        <div className="flex items-center justify-between mb-3 px-1">
          <Link href={basePath} className="flex items-center space-x-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Car<span className="text-blue-500">Z</span>
              </span>
              <span className="ml-1.5 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Tenant Switcher */}
        <GarageSwitcher />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Menu Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col rounded-xl px-3 py-2 text-xs font-medium transition-all group",
                item.active
                  ? "bg-zinc-800/90 text-zinc-100 shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      item.active ? "text-blue-400" : "text-zinc-400 group-hover:text-zinc-200"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </div>

              {/* Stage Sub-indicators if present */}
              {item.stages && (
                <div className="flex items-center space-x-1 mt-2 pt-1 border-t border-zinc-800/40">
                  {item.stages.map((stg) => (
                    <span
                      key={stg.label}
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold border",
                        stg.color
                      )}
                    >
                      {stg.count} {stg.label}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom User Card */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
        <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 p-2.5 border border-zinc-800/60">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-xs">
              AG
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">
                Álefe Gestor
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center space-x-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Proprietário</span>
              </div>
            </div>
          </div>
          <button className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
