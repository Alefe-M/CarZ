"use client";

import React from "react";
import { useGarage } from "@/context/GarageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { BarChart3, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";

export default function ReportsPage() {
  const { garage, vehicles, sales, generalExpenses } = useGarage();

  // Financial aggregates
  const totalRevenue = sales.reduce((acc, s) => acc + s.finalSalePrice, 0);
  const totalCOGS = sales.reduce((acc, s) => acc + s.totalAccumulatedCost, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const totalFixedExpenses = generalExpenses.reduce((acc, ge) => acc + ge.amount, 0);
  const netResult = grossProfit - totalFixedExpenses;
  const netMargin = totalRevenue > 0 ? (netResult / totalRevenue) * 100 : 0;

  // Inventory investment
  const activeVehicles = vehicles.filter((v) => v.status !== "VENDIDO");
  const totalActiveCapital = activeVehicles.reduce(
    (acc, v) => acc + v.totalAccumulatedCost,
    0
  );
  const totalPartsInYard = activeVehicles.reduce((acc, v) => acc + v.totalPartsCost, 0);
  const totalLaborInYard = activeVehicles.reduce((acc, v) => acc + v.totalLaborCost, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Relatórios & Demonstrativo de Resultado (DRE)
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Apuração contábil e gerencial do resultado da garagem: margens, CMV e lucro operacional.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-zinc-400">Receita Bruta do Mês</span>
            <CardTitle className="text-2xl font-bold text-zinc-100">
              {formatCurrency(totalRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-500">{sales.length} carros faturados</span>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-950/10">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-emerald-400">Lucro Bruto (Margem)</span>
            <CardTitle className="text-2xl font-bold text-emerald-400">
              {formatCurrency(grossProfit)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-emerald-300 flex items-center font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              Margem bruta de {formatPercent(grossMargin)}
            </span>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-950/10">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-blue-400">Resultado Líquido Final</span>
            <CardTitle className="text-2xl font-bold text-blue-400">
              {formatCurrency(netResult)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-blue-300 font-medium">
              Margem líquida de {formatPercent(netMargin)}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Demonstrativo DRE Detalhado */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <span>Estrutura do DRE Mensal (Competência)</span>
          </CardTitle>
          <CardDescription>
            Cálculo analítico conforme especificações financeiras do OpenSpec.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs">
            {/* 1. Receita */}
            <div className="flex justify-between items-center py-2 border-b border-zinc-800 text-sm">
              <span className="font-semibold text-zinc-200">
                1. (+) RECEITA OPERACIONAL BRUTA
              </span>
              <span className="font-bold text-zinc-100">
                {formatCurrency(totalRevenue)}
              </span>
            </div>

            {/* 2. CMV */}
            <div className="space-y-1.5 pl-3 border-l-2 border-rose-500/40">
              <div className="flex justify-between text-zinc-400">
                <span>2. (-) CUSTO DOS VEÍCULOS VENDIDOS (CMV)</span>
                <span className="font-semibold text-rose-400">
                  -{formatCurrency(totalCOGS)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Inclui valores de aquisição original somados a todas as peças trocadas e mão de obra alocada.
              </p>
            </div>

            {/* 3. Lucro Bruto */}
            <div className="flex justify-between items-center py-2.5 bg-emerald-500/10 px-3 rounded-lg border border-emerald-500/30 text-sm">
              <span className="font-bold text-emerald-300">
                3. (=) LUCRO BRUTO OPERACIONAL
              </span>
              <span className="font-extrabold text-emerald-400">
                {formatCurrency(grossProfit)} ({formatPercent(grossMargin)})
              </span>
            </div>

            {/* 4. Despesas Gerais */}
            <div className="space-y-1.5 pl-3 border-l-2 border-amber-500/40 pt-2">
              <div className="flex justify-between text-zinc-400">
                <span>4. (-) DESPESAS OPERACIONAIS FIXAS DA GARAGEM</span>
                <span className="font-semibold text-amber-400">
                  -{formatCurrency(totalFixedExpenses)}
                </span>
              </div>
              <div className="space-y-1 pt-1 text-[11px] text-zinc-400">
                {generalExpenses.map((ge) => (
                  <div key={ge.id} className="flex justify-between">
                    <span className="text-zinc-500">• {ge.description}</span>
                    <span>{formatCurrency(ge.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Lucro Líquido */}
            <div className="flex justify-between items-center py-3 bg-zinc-950 px-4 rounded-xl border border-zinc-800 text-base font-extrabold mt-4">
              <span className="text-zinc-100">5. (=) RESULTADO LÍQUIDO FINAL DO EXERCÍCIO</span>
              <span className={netResult >= 0 ? "text-emerald-400" : "text-rose-400"}>
                {formatCurrency(netResult)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patrimônio Imobilizado em Pátio */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <Layers className="h-4 w-4 text-zinc-400" />
            <span>Investimento Total Imobilizado em Estoque Ativo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
              <span className="text-zinc-400 text-[11px] block">Capital em Veículos (Compra)</span>
              <span className="text-sm font-bold text-zinc-200">
                {formatCurrency(
                  activeVehicles.reduce((acc, v) => acc + v.acquisitionPrice, 0)
                )}
              </span>
            </div>
            <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
              <span className="text-cyan-400 text-[11px] block">Peças Aplicadas no Pátio</span>
              <span className="text-sm font-bold text-cyan-400">
                {formatCurrency(totalPartsInYard)}
              </span>
            </div>
            <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800">
              <span className="text-violet-400 text-[11px] block">Mão de Obra / Serviços no Pátio</span>
              <span className="text-sm font-bold text-violet-400">
                {formatCurrency(totalLaborInYard)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
