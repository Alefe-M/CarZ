"use client";

import React, { useState } from "react";
import { useGarage } from "@/context/GarageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SellVehicleModal } from "@/components/modals/SellVehicleModal";
import { formatCurrency, formatDate, formatPlate } from "@/lib/utils";
import {
  BadgeDollarSign,
  ArrowLeftRight,
  TrendingUp,
  Plus,
  Car,
  User,
  CheckCircle2,
} from "lucide-react";

export default function SalesPage() {
  const { garage, sales, vehicles } = useGarage();
  const [modalOpen, setModalOpen] = useState(false);

  const totalRevenue = sales.reduce((acc, s) => acc + s.finalSalePrice, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.netProfit, 0);
  const tradeInSalesCount = sales.filter((s) => s.hasTradeIn).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Vendas Realizadas & Trade-in
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Histórico comercial das negociações fechadas, apuração de lucro líquido e veículos recebidos na troca.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-sm shadow-emerald-950"
        >
          <BadgeDollarSign className="h-3.5 w-3.5" />
          <span>Registrar Venda (Trade-in)</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-zinc-400">Receita Total de Vendas</span>
            <CardTitle className="text-2xl font-bold text-zinc-100">
              {formatCurrency(totalRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-500">{sales.length} vendas registradas</span>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-950/10">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-emerald-400">Lucro Líquido Realizado</span>
            <CardTitle className="text-2xl font-bold text-emerald-400">
              {formatCurrency(totalProfit)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-emerald-400/80">
              Margem líquida de{" "}
              {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
            </span>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-950/10">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-blue-400">Vendas com Trade-in (Troca)</span>
            <CardTitle className="text-2xl font-bold text-blue-400">
              {tradeInSalesCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-blue-300/80">
              Carros cadastrados automaticamente em [Preparação]
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-zinc-200">
            Histórico das Negociações Fechadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40 text-xs">
            {sales.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                Nenhuma venda registrada ainda.
              </div>
            ) : (
              sales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-100 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {formatPlate(sale.plate)}
                      </span>
                      <span className="font-semibold text-zinc-200">
                        {sale.vehicleName}
                      </span>
                      {sale.hasTradeIn && (
                        <span className="rounded bg-blue-500/10 text-blue-400 px-2 py-0.5 text-[10px] border border-blue-500/20 font-medium flex items-center gap-1">
                          <ArrowLeftRight className="h-3 w-3" />
                          Trade-in ({sale.tradeInVehiclePlate})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-zinc-500" />
                        Comprador: <strong>{sale.customerName}</strong>
                      </span>
                      <span>•</span>
                      <span>{formatDate(sale.saleDate)}</span>
                      <span>•</span>
                      <span className="text-zinc-500">Forma: {sale.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Financial Results per Sale */}
                  <div className="flex items-center space-x-4 shrink-0 text-right">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Custo Acumulado</span>
                      <span className="text-zinc-300 font-medium">
                        {formatCurrency(sale.totalAccumulatedCost)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Valor Venda</span>
                      <span className="text-zinc-100 font-bold">
                        {formatCurrency(sale.finalSalePrice)}
                      </span>
                    </div>
                    <div className="pl-3 border-l border-zinc-800">
                      <span className="text-[10px] text-emerald-400 block font-medium">
                        Lucro Líquido
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {formatCurrency(sale.netProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <SellVehicleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
