"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGarage } from "@/context/GarageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { SellVehicleModal } from "@/components/modals/SellVehicleModal";
import { formatCurrency, formatDate, formatPlate } from "@/lib/utils";
import {
  Car,
  Wrench,
  BadgeDollarSign,
  ArrowLeft,
  Calendar,
  Layers,
  Fuel,
  Gauge,
  Palette,
  FileCheck2,
  Building2,
  Sparkles,
  ArrowRight,
  Clock,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

export default function VehicleDossierPage() {
  const params = useParams();
  const router = useRouter();
  const { garage, vehicles, updateVehicleStatus } = useGarage();

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const vehicleId = params.id as string;
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-zinc-300">Veículo não encontrado</h2>
        <p className="text-xs text-zinc-500">
          O veículo solicitado não pertence a esta garagem ou foi removido.
        </p>
        <Link href={`/${garage.slug}/veiculos`}>
          <Button size="sm" variant="outline" className="text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Voltar ao Estoque
          </Button>
        </Link>
      </div>
    );
  }

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

  const handleAdvanceToForSale = () => {
    updateVehicleStatus(vehicle.id, "A_VENDA", "Veículo revisado e liberado para venda.");
  };

  const handleReturnToPrep = () => {
    updateVehicleStatus(vehicle.id, "PREPARACAO", "Retornado para manutenção preventiva.");
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href={`/${garage.slug}/veiculos`}
          className="inline-flex items-center text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Voltar para o Estoque</span>
        </Link>

        {/* State Machine Action Buttons */}
        <div className="flex items-center space-x-2">
          {isPrep && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExpenseModalOpen(true)}
                className="text-xs gap-1.5 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>+ Lançar Peça / Serviço</span>
              </Button>
              <Button
                size="sm"
                variant="emerald"
                onClick={handleAdvanceToForSale}
                className="text-xs gap-1.5 font-semibold"
              >
                <span>Avançar para [À VENDA]</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          {isForSale && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReturnToPrep}
                className="text-xs gap-1 text-zinc-400 hover:text-zinc-200"
              >
                <span>Retornar para Preparação</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExpenseModalOpen(true)}
                className="text-xs gap-1.5 border-zinc-700"
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>+ Adicionar Manutenção</span>
              </Button>
              <Button
                size="sm"
                variant="emerald"
                onClick={() => setSellModalOpen(true)}
                className="text-xs gap-1.5 font-semibold shadow-md shadow-emerald-950"
              >
                <BadgeDollarSign className="h-3.5 w-3.5" />
                <span>Concluir Venda (Trade-in)</span>
              </Button>
            </>
          )}

          {isSold && (
            <div className="flex items-center space-x-1.5 text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Veículo Vendido & Dossiê Congelado</span>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Hero Dossier Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 md:p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-zinc-100 text-xs bg-zinc-950 px-2 py-0.5 rounded border border-zinc-700">
                <span className="text-[10px] text-blue-400 mr-1 font-sans">BR</span>
                {formatPlate(vehicle.plate)}
              </span>

              {isPrep && <Badge variant="preparacao">🟡 EM PREPARAÇÃO</Badge>}
              {isForSale && <Badge variant="a_venda">🟢 DISPONÍVEL À VENDA</Badge>}
              {isSold && <Badge variant="vendido">🟣 VENDIDO</Badge>}

              {fipeDiff > 0 && (
                <Badge variant="fipe">
                  -{fipeDiff.toFixed(1)}% abaixo da FIPE
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-zinc-100">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-xs text-zinc-400">
              {vehicle.version} • Ano Modelo {vehicle.yearModel} / Fab. {vehicle.yearManufacture}
            </p>
          </div>

          {/* Quick Technical Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <div className="flex items-center space-x-1">
              <Palette className="h-3.5 w-3.5 text-zinc-400" />
              <span>Cor: <strong className="text-zinc-200">{vehicle.color}</strong></span>
            </div>
            <div className="flex items-center space-x-1">
              <Gauge className="h-3.5 w-3.5 text-zinc-400" />
              <span>Km: <strong className="text-zinc-200">{vehicle.mileageCurrent?.toLocaleString("pt-BR") || 0} km</strong></span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>Entrada: <strong className="text-zinc-200">{formatDate(vehicle.acquisitionDate)}</strong></span>
            </div>
          </div>
        </div>

        {/* Technical Specs Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-[11px] text-zinc-400">
          <div>
            <span>Chassi (VIN):</span>{" "}
            <span className="font-mono text-zinc-200">{vehicle.vin || "Não informado"}</span>
          </div>
          <div>
            <span>Renavam:</span>{" "}
            <span className="font-mono text-zinc-200">{vehicle.renavam || "Não informado"}</span>
          </div>
          <div>
            <span>Código FIPE:</span>{" "}
            <span className="font-mono text-zinc-200">{vehicle.fipeCode || "002167-9"}</span>
          </div>
          <div>
            <span>FIPE na Aquisição:</span>{" "}
            <span className="font-semibold text-blue-400">
              {formatCurrency(vehicle.fipePriceAtAcquisition || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* TOP FINANCIAL SUMMARY (4 Metric Badges in a row + BIG BOLD TOTAL) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:p-5 shadow-lg">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Composição Consolidada de Custos do Veículo
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
          {/* 1. Compra */}
          <div className="rounded-xl bg-zinc-900/80 p-3 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block">Preço de Compra</span>
            <span className="text-base font-bold text-zinc-200">
              {formatCurrency(vehicle.acquisitionPrice)}
            </span>
          </div>

          {/* 2. Peças */}
          <div className="rounded-xl bg-cyan-950/20 p-3 border border-cyan-500/30">
            <span className="text-[11px] text-cyan-400 font-medium block">
              (+) Total Peças
            </span>
            <span className="text-base font-bold text-cyan-400">
              {formatCurrency(vehicle.totalPartsCost)}
            </span>
          </div>

          {/* 3. Mão de Obra */}
          <div className="rounded-xl bg-violet-950/20 p-3 border border-violet-500/30">
            <span className="text-[11px] text-violet-400 font-medium block">
              (+) Total Mão de Obra
            </span>
            <span className="text-base font-bold text-violet-400">
              {formatCurrency(vehicle.totalLaborCost)}
            </span>
          </div>

          {/* 4. Taxas / Outros */}
          <div className="rounded-xl bg-zinc-900/80 p-3 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block">
              (+) Taxas / Outros
            </span>
            <span className="text-base font-bold text-zinc-300">
              {formatCurrency(vehicle.totalOtherCost)}
            </span>
          </div>

          {/* 5. CUSTO TOTAL ACUMULADO (Bold Highlight) */}
          <div className="col-span-2 md:col-span-1 rounded-xl bg-amber-500/10 p-3 border border-amber-500/40 shadow-sm">
            <span className="text-[11px] font-bold text-amber-400 block uppercase">
              (=) Custo Total Acumulado
            </span>
            <span className="text-lg font-extrabold text-amber-300">
              {formatCurrency(vehicle.totalAccumulatedCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Maintenance & Expenses Feed */}
      <Card className="border-zinc-800/90 bg-zinc-900/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-400" />
              <span>Dossiê de Manutenções & Serviços Realizados</span>
            </CardTitle>
            <CardDescription>
              Histórico cronológico de tudo que foi instalado ou executado neste veículo.
            </CardDescription>
          </div>

          {isPrep && (
            <Button
              size="sm"
              onClick={() => setExpenseModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1 font-semibold"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Lançar Manutenção</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vehicle.expenses.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                Nenhum gasto ou manutenção registrado para este veículo ainda.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40">
                {vehicle.expenses.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-200">
                          {exp.description}
                        </span>
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-mono">
                          {exp.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                        <span>{formatDate(exp.expenseDate)}</span>
                        {exp.supplierName && (
                          <>
                            <span>•</span>
                            <span className="text-zinc-400">{exp.supplierName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Breakdown per Item: Peças x Mão de Obra x Total */}
                    <div className="flex items-center space-x-3 text-xs shrink-0">
                      {Number(exp.partsCost) > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block">Peças</span>
                          <span className="font-semibold text-cyan-400">
                            {formatCurrency(exp.partsCost)}
                          </span>
                        </div>
                      )}

                      {Number(exp.laborCost) > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block">Mão de Obra</span>
                          <span className="font-semibold text-violet-400">
                            {formatCurrency(exp.laborCost)}
                          </span>
                        </div>
                      )}

                      <div className="text-right pl-3 border-l border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Total Item</span>
                        <span className="font-bold text-zinc-100 text-sm">
                          {formatCurrency(exp.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        defaultVehicleId={vehicle.id}
      />

      <SellVehicleModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        defaultVehicleId={vehicle.id}
      />
    </div>
  );
}
