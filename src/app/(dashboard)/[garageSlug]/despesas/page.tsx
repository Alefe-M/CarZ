"use client";

import React, { useState } from "react";
import { useGarage } from "@/context/GarageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt, Plus, CheckCircle2, Clock, DollarSign, Building2 } from "lucide-react";

export default function GeneralExpensesPage() {
  const { garage, generalExpenses, addGeneralExpense } = useGarage();

  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState("ALUGUEL_CONDOMINIO");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [dueDate, setDueDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);

  const totalExpenses = generalExpenses.reduce((acc, ge) => acc + ge.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    addGeneralExpense({
      category,
      description,
      amount: Number(amount),
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      isRecurring,
    });

    setDescription("");
    setAmount("");
    setDueDate("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Despesas Gerais da Garagem
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Custos fixos operacionais (Aluguel, Anúncios Webmotors, Energia, Softwares) que impactam o DRE.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nova Despesa Fixa</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-zinc-400">Total Mensal Fixado</span>
            <CardTitle className="text-2xl font-bold text-amber-400">
              {formatCurrency(totalExpenses)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-500">
              {generalExpenses.length} custos cadastrados
            </span>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-zinc-400">Maior Custo</span>
            <CardTitle className="text-lg font-bold text-zinc-200">
              Aluguel do Pátio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-400 font-semibold">
              R$ 4.500,00 / mês
            </span>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-zinc-400">Impacto no Pátio</span>
            <CardTitle className="text-lg font-bold text-emerald-400">
              Controlado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-zinc-400">
              Despesas diluídas no DRE mensal
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-zinc-200">
            Lançamentos de Gastos Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40 text-xs">
            {generalExpenses.map((ge) => (
              <div
                key={ge.id}
                className="p-3.5 flex items-center justify-between hover:bg-zinc-900/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{ge.description}</span>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-mono">
                      {ge.category}
                    </span>
                    {ge.isRecurring && (
                      <span className="rounded bg-blue-500/10 text-blue-400 px-2 py-0.5 text-[10px] border border-blue-500/20">
                        Recorrente Mensal
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Vencimento: {formatDate(ge.dueDate)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-zinc-100 block">
                    {formatCurrency(ge.amount)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {ge.isPaid ? "Pago" : "A Pagar"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Cadastrar Nova Despesa Geral"
        description="Lançamento de custos fixos que incidem sobre o resultado operacional da loja."
      >
        <form onSubmit={handleAddExpense} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALUGUEL_CONDOMINIO">Aluguel & Condomínio do Pátio</option>
              <option value="MARKETING_ANUNCIOS">Marketing & Anúncios (Webmotors/iCarros)</option>
              <option value="SISTEMAS_SOFTWARES">Softwares & Sistemas</option>
              <option value="ENERGIA_AGUA_INTERNET">Energia, Água & Conectividade</option>
              <option value="SALARIOS_EQUIPE">Salários & Folha Fixa</option>
              <option value="OUTROS">Outros Custos Gerais</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Descrição
            </label>
            <Input
              placeholder="Ex: Mensalidade Webmotors"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Valor (R$)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="Ex: 2200"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Data de Vencimento
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Salvar Despesa
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
