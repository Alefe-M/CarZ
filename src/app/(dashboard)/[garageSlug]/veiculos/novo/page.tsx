"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGarage } from "@/context/GarageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { VehicleStatus, VehicleAcquisitionType } from "@prisma/client";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Car,
  Search,
  Sparkles,
  ArrowLeft,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

// Kept only as type-compatible legacy examples; the form loads FIPE data via the proxy below.
const POPULAR_BRANDS = [
  { codigo: "56", nome: "Toyota" },
  { codigo: "25", nome: "Honda" },
  { codigo: "29", nome: "Jeep" },
  { codigo: "23", nome: "Chevrolet" },
  { codigo: "59", nome: "VW - VolksWagen" },
  { codigo: "21", nome: "Fiat" },
  { codigo: "26", nome: "Hyundai" },
  { codigo: "44", nome: "Nissan" },
];

const MODELS_BY_BRAND: Record<string, Array<{ codigo: string; nome: string }>> = {
  "56": [
    { codigo: "4921", nome: "Corolla XEi 2.0 Flex 16V Aut." },
    { codigo: "4920", nome: "Corolla Altis 2.0 16V Flex Aut." },
    { codigo: "4922", nome: "Corolla Cross XRE 2.0 Flex Aut." },
    { codigo: "4923", nome: "Hilux CD SRV 4x4 2.8 TDI Diesel Aut." },
  ],
  "25": [
    { codigo: "4010", nome: "Civic Touring 1.5 Turbo 16V Aut." },
    { codigo: "4011", nome: "Civic EXL 2.0 Flex 16V Aut." },
    { codigo: "4012", nome: "HR-V EXL 1.5 Flex 16V Aut." },
  ],
  "29": [
    { codigo: "3510", nome: "Compass Longitude 1.3 T270 Turbo Flex Aut." },
    { codigo: "3511", nome: "Renegade Longitude 1.3 T270 Flex Aut." },
    { codigo: "3512", nome: "Commander Limited 1.3 Turbo Flex Aut." },
  ],
  "23": [
    { codigo: "2110", nome: "Onix LTZ 1.0 Turbo Flex Aut." },
    { codigo: "2111", nome: "Tracker Premier 1.2 Turbo Flex Aut." },
    { codigo: "2112", nome: "Cruze LTZ 1.4 Turbo Flex Aut." },
  ],
  "59": [
    { codigo: "5110", nome: "T-Cross Highline 250 TSI 1.4 Flex Aut." },
    { codigo: "5111", nome: "Nivus Highline 200 TSI 1.0 Flex Aut." },
    { codigo: "5112", nome: "Polo Highline 200 TSI 1.0 Flex Aut." },
  ],
  "21": [
    { codigo: "1110", nome: "Pulse Impetus 1.0 Turbo 200 Flex Aut." },
    { codigo: "1111", nome: "Fastback Limited 1.3 Turbo Flex Aut." },
    { codigo: "1112", nome: "Toro Volcano 1.3 Turbo 270 Flex Aut." },
  ],
};

const YEARS_BY_MODEL: Record<
  string,
  Array<{ codigo: string; nome: string; preco: number; codigoFipe: string }>
> = {
  "4921": [
    { codigo: "2023-1", nome: "2023 Gasolina", preco: 128500, codigoFipe: "002167-9" },
    { codigo: "2022-1", nome: "2022 Gasolina", preco: 115820, codigoFipe: "002167-9" },
    { codigo: "2021-1", nome: "2021 Gasolina", preco: 106000, codigoFipe: "002167-9" },
  ],
  "4010": [
    { codigo: "2021-1", nome: "2021 Gasolina", preco: 132000, codigoFipe: "014092-9" },
    { codigo: "2020-1", nome: "2020 Gasolina", preco: 122000, codigoFipe: "014092-9" },
  ],
  "3510": [
    { codigo: "2023-1", nome: "2023 Flex", preco: 152000, codigoFipe: "017088-7" },
    { codigo: "2022-1", nome: "2022 Flex", preco: 139000, codigoFipe: "017088-7" },
  ],
  "2110": [
    { codigo: "2022-1", nome: "2022 Flex", preco: 78000, codigoFipe: "004489-0" },
    { codigo: "2020-1", nome: "2020 Flex", preco: 69000, codigoFipe: "004489-0" },
  ],
};

export default function NewVehiclePage() {
  const router = useRouter();
  const { garage, addVehicle } = useGarage();

  // FIPE Cascade State
  const [selectedBrandCode, setSelectedBrandCode] = useState("");
  const [selectedModelCode, setSelectedModelCode] = useState("");
  const [selectedYearCode, setSelectedYearCode] = useState("");
  const [brands, setBrands] = useState<Array<{ codigo: string; nome: string }>>([]);
  const [models, setModels] = useState<Array<{ codigo: string | number; nome: string }>>([]);
  const [years, setYears] = useState<Array<{ codigo: string; nome: string }>>([]);

  // Form Fields
  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  const [versionName, setVersionName] = useState("");
  const [yearManufacture, setYearManufacture] = useState(new Date().getFullYear());
  const [yearModel, setYearModel] = useState(new Date().getFullYear());
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [renavam, setRenavam] = useState("");
  const [color, setColor] = useState("Prata");
  const [mileage, setMileage] = useState<number | "">("");

  // FIPE Data
  const [fipePrice, setFipePrice] = useState(0);
  const [fipeCode, setFipeCode] = useState("");

  // Acquisition Financials
  const [acquisitionType, setAcquisitionType] = useState<VehicleAcquisitionType>(
    VehicleAcquisitionType.COMPRA_DIRETA_PF
  );
  const [acquisitionPrice, setAcquisitionPrice] = useState<number | "">("");
  const [targetSalePrice, setTargetSalePrice] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetch("/api/v1/fipe/marcas").then(r => r.ok ? r.json() : []).then(setBrands).catch(() => setBrands([])); }, []);
  useEffect(() => { if (!selectedBrandCode) return; fetch(`/api/v1/fipe/marcas/${selectedBrandCode}/modelos`).then(r => r.ok ? r.json() : { modelos: [] }).then(data => { setModels(data.modelos || []); setSelectedModelCode(""); setYears([]); setSelectedYearCode(""); }).catch(() => setModels([])); }, [selectedBrandCode]);
  useEffect(() => { if (!selectedBrandCode || !selectedModelCode) return; fetch(`/api/v1/fipe/marcas/${selectedBrandCode}/modelos/${selectedModelCode}/anos`).then(r => r.ok ? r.json() : []).then(data => { setYears(data); setSelectedYearCode(""); }).catch(() => setYears([])); }, [selectedBrandCode, selectedModelCode]);
  useEffect(() => { if (!selectedBrandCode || !selectedModelCode || !selectedYearCode) return; fetch(`/api/v1/fipe/marcas/${selectedBrandCode}/modelos/${selectedModelCode}/anos/${selectedYearCode}`).then(r => r.ok ? r.json() : null).then(data => { if (!data) return; setFipePrice(Number(data.valorNumerico || 0)); setFipeCode(data.CodigoFipe || ""); setBrandName(data.Marca || brandName); setModelName(data.Modelo || modelName); setVersionName(""); setYearModel(Number(data.AnoModelo) || yearModel); setYearManufacture(Number(data.AnoModelo) || yearManufacture); }).catch(() => undefined); }, [selectedBrandCode, selectedModelCode, selectedYearCode]);

  const availableModels = models;
  const availableYears = years;

  // Handle Brand Change
  const handleBrandChange = (brandCode: string) => {
    setSelectedBrandCode(brandCode);
    const b = brands.find((x) => x.codigo === brandCode);
    if (b) setBrandName(b.nome);
  };

  // Handle Model Change
  const handleModelChange = (modelCode: string) => {
    setSelectedModelCode(modelCode);
    const m = models.find((x) => String(x.codigo) === modelCode);
    if (m) {
      const parts = m.nome.split(" ");
      setModelName(parts[0]);
      setVersionName(parts.slice(1).join(" "));
    }

  };

  // Handle Year Change
  const handleYearChange = (yearCode: string) => {
    setSelectedYearCode(yearCode);
    const yr = availableYears.find((x) => x.codigo === yearCode);
    if (yr) {
      const parsedYear = parseInt(yr.nome.slice(0, 4)) || new Date().getFullYear();
      setYearModel(parsedYear);
      setYearManufacture(parsedYear - 1);
    }
  };

  // Deságio FIPE (%) Calculation in real-time
  const purchaseNum = Number(acquisitionPrice) || 0;
  const desagioFipe =
    fipePrice > 0 && purchaseNum > 0
      ? ((fipePrice - purchaseNum) / fipePrice) * 100
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || purchaseNum <= 0) return;

    setSubmitting(true);
    try {
      const created = await addVehicle({
        plate: plate.toUpperCase().trim(),
        vin,
        renavam,
        brand: brandName,
        model: modelName,
        version: versionName,
        yearManufacture: Number(yearManufacture),
        yearModel: Number(yearModel),
        color,
        mileageCurrent: Number(mileage) || 0,
        status: VehicleStatus.PREPARACAO, // Every vehicle starts in Preparação!
        acquisitionType,
        acquisitionPrice: purchaseNum,
        fipeCode,
        fipePriceAtAcquisition: fipePrice,
        fipeReferenceMonth: "Setembro de 2026",
        targetSalePrice: Number(targetSalePrice) || purchaseNum * 1.2,
        notes,
      });

      // Redirect directly to the newly created vehicle's dossier
      router.push(`/${garage.slug}/veiculos/${created.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${garage.slug}/veiculos`}
          className="inline-flex items-center text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Voltar para Veículos</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <span>Nova Entrada de Veículo no Pátio</span>
          <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
            Etapa 1: PREPARAÇÃO
          </span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Utilize o auto-lookup da Tabela FIPE para obter dados de mercado e calcular o deságio da compra.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FIPE Quick Auto-Lookup Section */}
        <Card className="border-blue-500/30 bg-blue-950/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-blue-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>Consulta & Autopreenchimento FIPE</span>
              </CardTitle>
              <span className="text-[10px] text-blue-300/80">Parallelum FIPE API Gateway</span>
            </div>
            <CardDescription className="text-xs text-zinc-400">
              Selecione a marca, modelo e ano para obter a cotação oficial da FIPE.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Marca */}
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  1. Marca do Veículo
                </label>
                <select
                  value={selectedBrandCode}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {brands.map((b) => (
                    <option key={b.codigo} value={b.codigo}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modelo */}
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  2. Modelo & Versão
                </label>
                <select
                  value={selectedModelCode}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {availableModels.map((m) => (
                    <option key={m.codigo} value={m.codigo}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ano */}
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  3. Ano Modelo & Combustível
                </label>
                <select
                  value={selectedYearCode}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {availableYears.map((y) => (
                    <option key={y.codigo} value={y.codigo}>
                      {y.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FIPE Values Display Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/80 border border-blue-500/20">
              <div className="flex items-center space-x-3">
                <div className="text-xs text-zinc-400">
                  Código FIPE: <strong className="font-mono text-zinc-200">{fipeCode}</strong>
                </div>
                <span className="text-zinc-600">•</span>
                <div className="text-xs text-zinc-400">
                  Preço Médio FIPE:{" "}
                  <strong className="text-sm font-bold text-blue-400">
                    {formatCurrency(fipePrice)}
                  </strong>
                </div>
              </div>
              <span className="text-[10px] text-zinc-500">Mês Ref: Setembro/2026</span>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Identity & Identification */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-zinc-200">
              Identificação do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Placa do Veículo *
                </label>
                <Input
                  placeholder="Ex: BRA2E19"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  required
                  className="font-mono uppercase font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Cor
                </label>
                <Input
                  placeholder="Ex: Prata, Preto, Branco"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Quilometragem Atual (Km)
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 45000"
                  value={mileage}
                  onChange={(e) =>
                    setMileage(e.target.value === "" ? "" : parseInt(e.target.value))
                  }
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Número do Chassi (VIN)
                </label>
                <Input
                  placeholder="Ex: 9BWZZZ377VT..."
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="font-mono uppercase text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Código Renavam
                </label>
                <Input
                  placeholder="Ex: 12345678901"
                  value={renavam}
                  onChange={(e) => setRenavam(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financials & Deságio FIPE Calculation */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-zinc-200">
              Condições de Compra & Preço Alvo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Tipo de Aquisição
                </label>
                <select
                  value={acquisitionType}
                  onChange={(e) => setAcquisitionType(e.target.value as VehicleAcquisitionType)}
                  className="flex h-9 w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={VehicleAcquisitionType.COMPRA_DIRETA_PF}>
                    Compra Direta (Pessoa Física)
                  </option>
                  <option value={VehicleAcquisitionType.COMPRA_DIRETA_PJ}>
                    Compra Direta (Pessoa Jurídica)
                  </option>
                  <option value={VehicleAcquisitionType.LEILAO}>Leilão</option>
                  <option value={VehicleAcquisitionType.TROCA_TRADE_IN}>
                    Veículo na Troca (Trade-in)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-amber-400 block mb-1">
                  Preço de Aquisição (Compra) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 95000"
                  value={acquisitionPrice}
                  onChange={(e) =>
                    setAcquisitionPrice(
                      e.target.value === "" ? "" : parseFloat(e.target.value)
                    )
                  }
                  required
                  className="text-xs border-amber-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-emerald-400 block mb-1">
                  Preço Alvo de Venda Anunciado
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 112000"
                  value={targetSalePrice}
                  onChange={(e) =>
                    setTargetSalePrice(
                      e.target.value === "" ? "" : parseFloat(e.target.value)
                    )
                  }
                  className="text-xs border-emerald-500/40"
                />
              </div>
            </div>

            {/* REAL-TIME DESÁGIO FIPE INDICATOR */}
            {purchaseNum > 0 && fipePrice > 0 && (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  desagioFipe >= 12
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : desagioFipe > 0
                    ? "bg-blue-950/20 border-blue-500/30 text-blue-300"
                    : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    {desagioFipe >= 0 ? (
                      <TrendingDown className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose-400 rotate-180" />
                    )}
                    <span>
                      {desagioFipe >= 0
                        ? `Deságio na Compra: ${desagioFipe.toFixed(1)}% abaixo da Tabela FIPE`
                        : `Compra acima da FIPE em ${Math.abs(desagioFipe).toFixed(1)}%`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    FIPE: {formatCurrency(fipePrice)} | Compra: {formatCurrency(purchaseNum)} |
                    Diferença: {formatCurrency(Math.abs(fipePrice - purchaseNum))}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider font-bold block text-zinc-400">
                    Avaliação
                  </span>
                  <span className="text-xs font-extrabold">
                    {desagioFipe >= 15
                      ? "Excelente Margem"
                      : desagioFipe >= 8
                      ? "Boa Oportunidade"
                      : "Margem Estreita"}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Observações de Entrada
              </label>
              <Input
                placeholder="Ex: Veículo adquirido de único dono, revisões em concessionária."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link href={`/${garage.slug}/veiculos`}>
            <Button type="button" variant="outline" size="sm">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !plate || purchaseNum <= 0}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6"
          >
            {submitting ? "Cadastrando..." : "Cadastrar & Abrir Dossiê"}
          </Button>
        </div>
      </form>
    </div>
  );
}
