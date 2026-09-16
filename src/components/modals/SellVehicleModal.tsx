"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useGarage, VehicleItem } from "@/context/GarageContext";
import { PaymentMethod } from "@prisma/client";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { BadgeDollarSign, ArrowLeftRight, TrendingUp, Sparkles } from "lucide-react";

interface SellVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVehicleId?: string;
}

export function SellVehicleModal({
  isOpen,
  onClose,
  defaultVehicleId,
}: SellVehicleModalProps) {
  const { vehicles, sellVehicle } = useGarage();

  const forSaleVehicles = vehicles.filter((v) => v.status === "A_VENDA");
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    defaultVehicleId || forSaleVehicles[0]?.id || ""
  );

  React.useEffect(() => {
    if (defaultVehicleId) {
      setSelectedVehicleId(defaultVehicleId);
    }
  }, [defaultVehicleId]);

  const targetVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const [customerName, setCustomerName] = useState("");
  const [customerDocument, setCustomerDocument] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [finalSalePrice, setFinalSalePrice] = useState<number | "">(
    targetVehicle?.targetSalePrice || ""
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.A_VISTA_PIX
  );
  const [salesCommission, setSalesCommission] = useState<number | "">("");

  // Trade-in Switch & Fields
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInBrand, setTradeInBrand] = useState("");
  const [tradeInModel, setTradeInModel] = useState("");
  const [tradeInVersion, setTradeInVersion] = useState("");
  const [tradeInYear, setTradeInYear] = useState(2020);
  const [tradeInPlate, setTradeInPlate] = useState("");
  const [tradeInAgreedValue, setTradeInAgreedValue] = useState<number | "">("");

  const [submitting, setSubmitting] = useState(false);

  // Financial calculations in real-time
  const saleNum = Number(finalSalePrice) || 0;
  const costNum = Number(targetVehicle?.totalAccumulatedCost) || 0;
  const commNum = Number(salesCommission) || 0;
  const grossProfit = saleNum - costNum;
  const netProfit = grossProfit - commNum;
  const grossMargin = saleNum > 0 ? (grossProfit / saleNum) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !customerName || !customerDocument || !customerPhone || saleNum <= 0) return;

    setSubmitting(true);
    try {
      await sellVehicle(selectedVehicleId, {
        customerName,
        customerDocument,
        customerPhone,
        finalSalePrice: saleNum,
        paymentMethod,
        salesCommission: commNum,
        tradeIn: hasTradeIn
          ? {
              brand: tradeInBrand || "Marca Troca",
              model: tradeInModel || "Modelo Troca",
              version: tradeInVersion || "Versão Troca",
              yearManufacture: Number(tradeInYear),
              yearModel: Number(tradeInYear),
              plate: tradeInPlate || "TRC-9999",
              color: "Prata",
              mileage: 50000,
              agreedValue: Number(tradeInAgreedValue) || 0,
            }
          : undefined,
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Concluir Venda de Veículo"
      description="Registre a transação comercial, comissões e entrada de veículo na troca (Trade-in)."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Veículo Selecionado */}
        <div>
          <label className="text-xs font-medium text-zinc-300 block mb-1">
            Veículo Sendo Vendido
          </label>
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              const found = vehicles.find((v) => v.id === e.target.value);
              if (found?.targetSalePrice) {
                setFinalSalePrice(found.targetSalePrice);
              }
            }}
            className="flex h-9 w-full rounded-lg border border-zinc-700/80 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            {forSaleVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} - {v.brand} {v.model} (Custo: {formatCurrency(v.totalAccumulatedCost)})
              </option>
            ))}
          </select>
        </div>

        {/* Cliente e Forma de Pagamento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Nome do Comprador / Cliente
            </label>
            <Input
              placeholder="Ex: Carlos Eduardo da Silva"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">CPF/CNPJ do Cliente</label>
            <Input placeholder="Somente números ou formatado" value={customerDocument} onChange={(e) => setCustomerDocument(e.target.value)} required className="text-xs" />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Telefone do Cliente</label>
            <Input placeholder="(11) 99999-9999" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required className="text-xs" />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Forma de Pagamento
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="flex h-9 w-full rounded-lg border border-zinc-700/80 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={PaymentMethod.A_VISTA_PIX}>À Vista (PIX)</option>
              <option value={PaymentMethod.A_VISTA_TED}>À Vista (TED/Transferência)</option>
              <option value={PaymentMethod.FINANCIAMENTO}>Financiamento Bancário</option>
              <option value={PaymentMethod.CARTAO_CREDITO}>Cartão de Crédito</option>
              <option value={PaymentMethod.VEICULO_TROCA}>Troca Integral / Parcial</option>
            </select>
          </div>
        </div>

        {/* Valores e Comissões */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Preço Final Fechado (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 125000"
              value={finalSalePrice}
              onChange={(e) =>
                setFinalSalePrice(e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Comissão do Vendedor (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 1000"
              value={salesCommission}
              onChange={(e) =>
                setSalesCommission(e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              className="text-xs"
            />
          </div>
        </div>

        {/* Simulação de Lucratividade em Tempo Real */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Custo Acumulado do Carro:</span>
            <span className="font-semibold text-zinc-200">{formatCurrency(costNum)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Lucro Bruto Realizado:</span>
            <span className={grossProfit >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {formatCurrency(grossProfit)} ({formatPercent(grossMargin)})
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-1.5">
            <span className="font-medium text-zinc-300">Lucro Líquido Final:</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {formatCurrency(netProfit)}
            </span>
          </div>
        </div>

        {/* Seção Trade-in (Veículo na Troca) */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowLeftRight className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Receber Veículo na Troca (Trade-in)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasTradeIn}
                onChange={(e) => setHasTradeIn(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {hasTradeIn && (
            <div className="space-y-2.5 pt-2 border-t border-blue-500/20 animate-in fade-in-0 duration-200">
              <p className="text-[11px] text-blue-300/80">
                O veículo recebido na troca entrará automaticamente no estoque com status{" "}
                <span className="font-bold text-amber-400">[PREPARAÇÃO]</span> pelo valor acordado.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-zinc-400 block mb-0.5">
                    Marca
                  </label>
                  <Input
                    placeholder="Ex: Fiat"
                    value={tradeInBrand}
                    onChange={(e) => setTradeInBrand(e.target.value)}
                    className="text-xs h-8"
                    required={hasTradeIn}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-zinc-400 block mb-0.5">
                    Modelo
                  </label>
                  <Input
                    placeholder="Ex: Argo"
                    value={tradeInModel}
                    onChange={(e) => setTradeInModel(e.target.value)}
                    className="text-xs h-8"
                    required={hasTradeIn}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-zinc-400 block mb-0.5">
                    Placa
                  </label>
                  <Input
                    placeholder="Ex: ABC1D23"
                    value={tradeInPlate}
                    onChange={(e) => setTradeInPlate(e.target.value)}
                    className="text-xs h-8 uppercase"
                    required={hasTradeIn}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-zinc-400 block mb-0.5">
                    Versão
                  </label>
                  <Input
                    placeholder="Ex: Drive 1.0 Flex"
                    value={tradeInVersion}
                    onChange={(e) => setTradeInVersion(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-amber-400 block mb-0.5">
                    Valor Acordado na Troca (R$)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 45000"
                    value={tradeInAgreedValue}
                    onChange={(e) =>
                      setTradeInAgreedValue(
                        e.target.value === "" ? "" : parseFloat(e.target.value)
                      )
                    }
                    className="text-xs h-8 border-amber-500/40"
                    required={hasTradeIn}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={submitting || saleNum <= 0 || !customerName || !customerDocument || !customerPhone}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
          >
            {submitting ? "Finalizando..." : "Confirmar Venda"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
