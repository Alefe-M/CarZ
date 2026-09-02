"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useGarage, VehicleItem } from "@/context/GarageContext";
import { ExpenseCategory } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { Wrench, Layers, DollarSign, UserCheck } from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVehicleId?: string;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  defaultVehicleId,
}: AddExpenseModalProps) {
  const { vehicles, addVehicleExpense } = useGarage();

  const [selectedVehicleId, setSelectedVehicleId] = useState(
    defaultVehicleId || vehicles[0]?.id || ""
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    ExpenseCategory.MANUTENCAO_MECANICA
  );
  const [description, setDescription] = useState("");
  const [partsCost, setPartsCost] = useState<number | "">("");
  const [laborCost, setLaborCost] = useState<number | "">("");
  const [otherCost, setOtherCost] = useState<number | "">("");
  const [supplierName, setSupplierName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync defaultVehicleId if changed
  React.useEffect(() => {
    if (defaultVehicleId) {
      setSelectedVehicleId(defaultVehicleId);
    }
  }, [defaultVehicleId]);

  const numParts = Number(partsCost) || 0;
  const numLabor = Number(laborCost) || 0;
  const numOther = Number(otherCost) || 0;
  const totalAmount = numParts + numLabor + numOther;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !description || totalAmount <= 0) return;

    setSubmitting(true);
    try {
      addVehicleExpense(selectedVehicleId, {
        category,
        description,
        partsCost: numParts,
        laborCost: numLabor,
        otherCost: numOther,
        supplierName: supplierName || "Oficina Mecânica Parceira",
      });

      // Reset
      setDescription("");
      setPartsCost("");
      setLaborCost("");
      setOtherCost("");
      setSupplierName("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lançar Manutenção / Despesa no Veículo"
      description="Discrimine os valores de peças e mão de obra para correta apropriação no dossiê financeiro."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Veículo Selector */}
        <div>
          <label className="text-xs font-medium text-zinc-300 block mb-1">
            Veículo Beneficiado
          </label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-zinc-700/80 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            {vehicles
              .filter((v) => v.status !== "VENDIDO")
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} - {v.brand} {v.model} ({v.status})
                </option>
              ))}
          </select>
        </div>

        {/* Categoria & Descrição */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Categoria do Gasto
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="flex h-9 w-full rounded-lg border border-zinc-700/80 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={ExpenseCategory.MANUTENCAO_MECANICA}>
                Mecânica Geral
              </option>
              <option value={ExpenseCategory.FUNILARIA_PINTURA}>
                Funilaria & Pintura
              </option>
              <option value={ExpenseCategory.ESTETICA_HIGIENIZACAO}>
                Estética & Polimento
              </option>
              <option value={ExpenseCategory.LAUDO_VISTORIA}>
                Laudo Cautelar / Vistoria
              </option>
              <option value={ExpenseCategory.DOCUMENTACAO_TAXAS}>
                Despachante & Taxas
              </option>
              <option value={ExpenseCategory.OUTRO_DIRETO}>
                Outros Serviços
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Fornecedor / Oficina
            </label>
            <Input
              placeholder="Ex: Auto Peças Central"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-300 block mb-1">
            Descrição do Serviço / Peça
          </label>
          <Input
            placeholder="Ex: Troca de pastilhas de freio dianteiras"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="text-xs"
          />
        </div>

        {/* Breakdown de Custos */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 space-y-3">
          <div className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
            <DollarSign className="h-4 w-4 text-blue-400" />
            <span>Detalhamento dos Valores (R$)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-medium text-cyan-400 block mb-1">
                Valor Peça(s)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={partsCost}
                onChange={(e) =>
                  setPartsCost(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                className="text-xs border-cyan-500/30 focus-visible:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-violet-400 block mb-1">
                Mão de Obra
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={laborCost}
                onChange={(e) =>
                  setLaborCost(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                className="text-xs border-violet-500/30 focus-visible:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Outros / Taxas
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={otherCost}
                onChange={(e) =>
                  setOtherCost(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                className="text-xs"
              />
            </div>
          </div>

          {/* Real-time Total Highlight */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <span className="text-xs text-zinc-400">Total Agregado ao Carro:</span>
            <span className="text-sm font-bold text-emerald-400">
              {formatCurrency(totalAmount)}
            </span>
          </div>
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
            disabled={submitting || totalAmount <= 0 || !description}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            {submitting ? "Gravando..." : "Salvar no Dossiê"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
