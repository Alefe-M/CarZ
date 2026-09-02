"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGarage } from "@/context/GarageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { PipelineKanban } from "@/components/vehicles/PipelineKanban";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { SellVehicleModal } from "@/components/modals/SellVehicleModal";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Car,
  Wrench,
  TrendingUp,
  Clock,
  Plus,
  BadgeDollarSign,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpRight,
  PieChart as PieIcon,
  Receipt,
} from "lucide-react";

export default function DashboardPage() {
  const { garage, vehicles, sales, generalExpenses } = useGarage();

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [activeVehicleId, setActiveVehicleId] = useState<string | undefined>(undefined);

  // 1. Calculations for KPIs
  const activeVehicles = vehicles.filter((v) => v.status !== "VENDIDO");
  const totalActiveCapital = activeVehicles.reduce(
    (acc, v) => acc + v.totalAccumulatedCost,
    0
  );

  const prepVehicles = vehicles.filter((v) => v.status === "PREPARACAO");
  const totalPrepParts = prepVehicles.reduce((acc, v) => acc + v.totalPartsCost, 0);
  const totalPrepLabor = prepVehicles.reduce((acc, v) => acc + v.totalLaborCost, 0);

  // Sales and Profit
  const totalGrossProfit = sales.reduce((acc, s) => acc + s.grossProfit, 0);
  const totalRevenue = sales.reduce((acc, s) => acc + s.finalSalePrice, 0);
  const avgMargin = totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;

  // Parts vs Labor Split for all vehicles
  const allParts = vehicles.reduce((acc, v) => acc + v.totalPartsCost, 0);
  const allLabor = vehicles.reduce((acc, v) => acc + v.totalLaborCost, 0);
  const totalMaintenance = allParts + allLabor;
  const partsPercentage = totalMaintenance > 0 ? (allParts / totalMaintenance) * 100 : 50;
  const laborPercentage = totalMaintenance > 0 ? (allLabor / totalMaintenance) * 100 : 50;

  const handleOpenExpense = (vehicleId?: string) => {
    setActiveVehicleId(vehicleId);
    setExpenseModalOpen(true);
  };

  const handleOpenSale = (vehicleId?: string) => {
    setActiveVehicleId(vehicleId);
    setSellModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Visão Geral</span>
            <span className="text-xs font-normal text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
              {garage.name}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Acompanhamento em tempo real do ciclo de vida dos veículos, despesas e margem comercial.
          </p>
        </div>

        {/* Action Top Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/${garage.slug}/veiculos/novo`}>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Entrada (FIPE)</span>
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenExpense()}
            className="text-xs gap-1.5 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Lançar Gasto / Peça</span>
          </Button>

          <Button
            size="sm"
            variant="emerald"
            onClick={() => handleOpenSale()}
            className="text-xs gap-1.5 font-semibold"
          >
            <BadgeDollarSign className="h-3.5 w-3.5" />
            <span>Concluir Venda</span>
          </Button>
        </div>
      </div>

      {/* 1. Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Estoque Ativo */}
        <Card className="border-zinc-800/90 bg-zinc-900/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Estoque Ativo</span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Car className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-zinc-100">
              {activeVehicles.length}{" "}
              <span className="text-xs font-normal text-zinc-400">veículos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-zinc-400">
              Valor investido:{" "}
              <span className="font-semibold text-zinc-200">
                {formatCurrency(totalActiveCapital)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Em Preparação (com desdobramento Peças x Mão de Obra) */}
        <Card className="border-amber-500/30 bg-amber-950/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-300">Em Preparação</span>
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-amber-400">
              {prepVehicles.length}{" "}
              <span className="text-xs font-normal text-zinc-400">veículos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-cyan-400 font-medium">
                Peças: {formatCurrency(totalPrepParts)}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-violet-400 font-medium">
                Serviços: {formatCurrency(totalPrepLabor)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Lucro Bruto do Mês */}
        <Card className="border-emerald-500/30 bg-emerald-950/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-300">Lucro Bruto do Mês</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-400">
              {formatCurrency(totalGrossProfit)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-400/90 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              <span>Margem média de {formatPercent(avgMargin)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Giro Médio de Estoque */}
        <Card className="border-zinc-800/90 bg-zinc-900/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Giro Médio de Estoque</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-zinc-100">
              28 <span className="text-xs font-normal text-zinc-400">dias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-zinc-400">
              Meta da loja: <span className="font-semibold text-zinc-300">≤ 35 dias</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Central Section: 3-Stage Vehicle Pipeline (Kanban vs Table) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">
              Pipeline de Veículos (3 Etapas)
            </h2>
            <p className="text-xs text-zinc-400">
              Ciclo operacional: [1. Preparação] ➔ [2. À Venda] ➔ [3. Vendido]
            </p>
          </div>

          {/* Toggle Kanban / Table */}
          <div className="flex items-center rounded-lg bg-zinc-900 p-1 border border-zinc-800">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "kanban"
                  ? "bg-zinc-800 text-zinc-100 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-zinc-800 text-zinc-100 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tabela</span>
            </button>
          </div>
        </div>

        {/* Render Kanban or Table View */}
        {viewMode === "kanban" ? (
          <PipelineKanban
            onOpenExpenseModal={handleOpenExpense}
            onOpenSaleModal={handleOpenSale}
          />
        ) : (
          <VehicleTable
            vehicles={vehicles}
            onOpenExpenseModal={handleOpenExpense}
            onOpenSaleModal={handleOpenSale}
          />
        )}
      </div>

      {/* 3. Analytics Breakdown: Peças vs Mão de Obra & DRE Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Maintenance Cost Split Widget */}
        <Card className="border-zinc-800/90 bg-zinc-900/60 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-zinc-200">
                Divisão de Gastos de Manutenção
              </CardTitle>
              <PieIcon className="h-4 w-4 text-zinc-400" />
            </div>
            <CardDescription>
              Apropriação entre Peças compradas e Mão de Obra terceirizada/serviços.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual Bar Split */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-400 font-medium">
                  Peças: {partsPercentage.toFixed(1)}%
                </span>
                <span className="text-violet-400 font-medium">
                  Mão de Obra: {laborPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden flex">
                <div
                  className="bg-cyan-500 transition-all duration-500"
                  style={{ width: `${partsPercentage}%` }}
                />
                <div
                  className="bg-violet-500 transition-all duration-500"
                  style={{ width: `${laborPercentage}%` }}
                />
              </div>
            </div>

            {/* Numeric Indicators */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80 text-xs">
              <div>
                <div className="text-[10px] text-zinc-400">Total em Peças</div>
                <div className="font-bold text-cyan-400 text-sm">
                  {formatCurrency(allParts)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">Total em Mão de Obra</div>
                <div className="font-bold text-violet-400 text-sm">
                  {formatCurrency(allLabor)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DRE Sintético Preview */}
        <Card className="border-zinc-800/90 bg-zinc-900/60 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-zinc-200">
                Demonstrativo de Resultado do Exercício (DRE Sintético)
              </CardTitle>
              <Link
                href={`/${garage.slug}/relatorios`}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Ver Relatório Completo →
              </Link>
            </div>
            <CardDescription>
              Apuração de receita, CMV dos veículos vendidos e despesas fixas da garagem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">(+) Receita Bruta de Vendas</span>
                <span className="font-bold text-zinc-100">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-rose-400">(-) Custo dos Veículos Vendidos (CMV)</span>
                <span className="font-medium text-rose-400">
                  {formatCurrency(totalRevenue - totalGrossProfit)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60 font-semibold">
                <span className="text-emerald-400">(=) Lucro Bruto Realizado</span>
                <span className="text-emerald-400">
                  {formatCurrency(totalGrossProfit)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-amber-400">(-) Despesas Gerais Fixas (Pátio, Aluguel, Anúncios)</span>
                <span className="font-medium text-amber-400">
                  {formatCurrency(
                    generalExpenses.reduce((acc, ge) => acc + ge.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm bg-zinc-950/60 px-3 rounded-lg border border-zinc-800/80 mt-2">
                <span className="text-zinc-200">(=) Resultado Líquido da Operação</span>
                <span className="text-emerald-400">
                  {formatCurrency(
                    totalGrossProfit -
                      generalExpenses.reduce((acc, ge) => acc + ge.amount, 0)
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
