"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { VehicleStatus, ExpenseCategory, PaymentMethod, VehicleAcquisitionType } from "@prisma/client";

export interface VehicleExpenseItem {
  id: string;
  vehicleId: string;
  category: ExpenseCategory;
  description: string;
  partsCost: number;
  laborCost: number;
  amount: number;
  expenseDate: string;
  supplierName?: string;
}

export interface VehicleItem {
  id: string;
  garageId: string;
  plate: string;
  vin: string;
  renavam: string;
  brand: string;
  model: string;
  version: string;
  yearManufacture: number;
  yearModel: number;
  color: string;
  mileageCurrent: number;
  status: VehicleStatus;
  acquisitionType: VehicleAcquisitionType;
  acquisitionDate: string;
  acquisitionPrice: number;
  fipeCode?: string;
  fipePriceAtAcquisition?: number;
  fipeReferenceMonth?: string;
  targetSalePrice?: number;
  minimumSalePrice?: number;
  notes?: string;
  expenses: VehicleExpenseItem[];
  // Calculated properties
  totalPartsCost: number;
  totalLaborCost: number;
  totalOtherCost: number;
  totalExpensesCost: number;
  totalAccumulatedCost: number;
}

export interface GeneralExpenseItem {
  id: string;
  garageId: string;
  category: string;
  description: string;
  amount: number;
  dueDate: string;
  isRecurring: boolean;
  isPaid: boolean;
}

export interface SaleItem {
  id: string;
  garageId: string;
  vehicleId: string;
  vehicleName: string;
  plate: string;
  customerName: string;
  saleDate: string;
  finalSalePrice: number;
  paymentMethod: PaymentMethod;
  totalAccumulatedCost: number;
  grossProfit: number;
  netProfit: number;
  hasTradeIn: boolean;
  tradeInVehiclePlate?: string;
}

export interface GarageInfo {
  id: string;
  name: string;
  slug: string;
  documentCnpjCpf: string;
  role: string;
}

interface GarageContextType {
  garage: GarageInfo;
  availableGarages: GarageInfo[];
  vehicles: VehicleItem[];
  generalExpenses: GeneralExpenseItem[];
  sales: SaleItem[];
  loading: boolean;
  switchGarage: (slug: string) => void;
  addVehicle: (data: Partial<VehicleItem>) => Promise<VehicleItem>;
  addVehicleExpense: (
    vehicleId: string,
    data: {
      category: ExpenseCategory;
      description: string;
      partsCost: number;
      laborCost: number;
      otherCost?: number;
      supplierName?: string;
    }
  ) => void;
  updateVehicleStatus: (vehicleId: string, newStatus: VehicleStatus, notes?: string) => void;
  sellVehicle: (
    vehicleId: string,
    saleData: {
      customerName: string;
      finalSalePrice: number;
      paymentMethod: PaymentMethod;
      salesCommission?: number;
      notes?: string;
      tradeIn?: {
        brand: string;
        model: string;
        version: string;
        yearManufacture: number;
        yearModel: number;
        plate: string;
        color: string;
        mileage: number;
        agreedValue: number;
      };
    }
  ) => void;
  addGeneralExpense: (data: Omit<GeneralExpenseItem, "id" | "garageId" | "isPaid">) => void;
}

const DEFAULT_GARAGES: GarageInfo[] = [
  {
    id: "g-alpha-motors-01",
    name: "Alpha Motors Revenda",
    slug: "alpha-motors",
    documentCnpjCpf: "12.345.678/0001-90",
    role: "OWNER",
  },
  {
    id: "g-prime-auto-02",
    name: "Prime Auto Seminovos",
    slug: "prime-auto",
    documentCnpjCpf: "98.765.432/0001-10",
    role: "GERENTE",
  },
];

const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: "v-corolla-01",
    garageId: "g-alpha-motors-01",
    plate: "BRA2E19",
    vin: "9BWZZZ377VT004251",
    renavam: "12345678901",
    brand: "Toyota",
    model: "Corolla",
    version: "XEi 2.0 Flex Aut.",
    yearManufacture: 2021,
    yearModel: 2022,
    color: "Prata",
    mileageCurrent: 45000,
    status: VehicleStatus.PREPARACAO,
    acquisitionType: VehicleAcquisitionType.COMPRA_DIRETA_PF,
    acquisitionDate: "2026-08-20",
    acquisitionPrice: 95000,
    fipeCode: "002167-9",
    fipePriceAtAcquisition: 115820,
    fipeReferenceMonth: "agosto de 2026",
    targetSalePrice: 112000,
    notes: "Carro em excelente estado, realizando revisão de freios e retoque estético.",
    expenses: [
      {
        id: "exp-01",
        vehicleId: "v-corolla-01",
        category: ExpenseCategory.MANUTENCAO_MECANICA,
        description: "Troca de pastilhas de freio dianteiras",
        partsCost: 20,
        laborCost: 50,
        amount: 70,
        expenseDate: "2026-08-22",
        supplierName: "Auto Peças Central",
      },
      {
        id: "exp-02",
        vehicleId: "v-corolla-01",
        category: ExpenseCategory.FUNILARIA_PINTURA,
        description: "Pintura e retoque do parachoque dianteiro",
        partsCost: 150,
        laborCost: 450,
        amount: 600,
        expenseDate: "2026-08-24",
        supplierName: "Oficina Funilaria Estrela",
      },
      {
        id: "exp-03",
        vehicleId: "v-corolla-01",
        category: ExpenseCategory.LAUDO_VISTORIA,
        description: "Laudo Cautelar 100% Aprovado (Dekra)",
        partsCost: 0,
        laborCost: 0,
        amount: 350,
        expenseDate: "2026-08-25",
        supplierName: "Dekra Vistorias",
      },
    ],
    totalPartsCost: 170,
    totalLaborCost: 500,
    totalOtherCost: 350,
    totalExpensesCost: 1020,
    totalAccumulatedCost: 96020,
  },
  {
    id: "v-compass-02",
    garageId: "g-alpha-motors-01",
    plate: "RIO2A18",
    vin: "9BWZZZ377VT009876",
    renavam: "98765432100",
    brand: "Jeep",
    model: "Compass",
    version: "Longitude 1.3 Turbo Flex Aut.",
    yearManufacture: 2022,
    yearModel: 2023,
    color: "Preto",
    mileageCurrent: 28000,
    status: VehicleStatus.A_VENDA,
    acquisitionType: VehicleAcquisitionType.COMPRA_DIRETA_PJ,
    acquisitionDate: "2026-08-10",
    acquisitionPrice: 130000,
    fipeCode: "017088-7",
    fipePriceAtAcquisition: 152000,
    fipeReferenceMonth: "agosto de 2026",
    targetSalePrice: 148000,
    minimumSalePrice: 144000,
    expenses: [
      {
        id: "exp-04",
        vehicleId: "v-compass-02",
        category: ExpenseCategory.ESTETICA_HIGIENIZACAO,
        description: "Polimento técnico, vitrificação e higienização interna",
        partsCost: 200,
        laborCost: 600,
        amount: 800,
        expenseDate: "2026-08-12",
        supplierName: "Studio Detail Car",
      },
    ],
    totalPartsCost: 200,
    totalLaborCost: 600,
    totalOtherCost: 0,
    totalExpensesCost: 800,
    totalAccumulatedCost: 130800,
  },
  {
    id: "v-civic-03",
    garageId: "g-alpha-motors-01",
    plate: "ABC4D12",
    vin: "9BWZZZ377VT005544",
    renavam: "55443322110",
    brand: "Honda",
    model: "Civic",
    version: "Touring 1.5 Turbo Aut.",
    yearManufacture: 2021,
    yearModel: 2021,
    color: "Cinza",
    mileageCurrent: 38000,
    status: VehicleStatus.A_VENDA,
    acquisitionType: VehicleAcquisitionType.COMPRA_DIRETA_PF,
    acquisitionDate: "2026-08-05",
    acquisitionPrice: 110000,
    fipeCode: "014092-9",
    fipePriceAtAcquisition: 132000,
    fipeReferenceMonth: "agosto de 2026",
    targetSalePrice: 125000,
    minimumSalePrice: 122000,
    expenses: [
      {
        id: "exp-05",
        vehicleId: "v-civic-03",
        category: ExpenseCategory.MANUTENCAO_MECANICA,
        description: "Troca de óleo de motor e todos os filtros",
        partsCost: 350,
        laborCost: 150,
        amount: 500,
        expenseDate: "2026-08-08",
        supplierName: "Honda Auto Center",
      },
    ],
    totalPartsCost: 350,
    totalLaborCost: 150,
    totalOtherCost: 0,
    totalExpensesCost: 500,
    totalAccumulatedCost: 110500,
  },
  {
    id: "v-onix-04",
    garageId: "g-alpha-motors-01",
    plate: "SPX1E22",
    vin: "9BWZZZ377VT001122",
    renavam: "11223344556",
    brand: "Chevrolet",
    model: "Onix",
    version: "LTZ 1.0 Turbo Aut.",
    yearManufacture: 2020,
    yearModel: 2020,
    color: "Branco",
    mileageCurrent: 52000,
    status: VehicleStatus.VENDIDO,
    acquisitionType: VehicleAcquisitionType.COMPRA_DIRETA_PF,
    acquisitionDate: "2026-08-01",
    acquisitionPrice: 58000,
    targetSalePrice: 70000,
    expenses: [
      {
        id: "exp-06",
        vehicleId: "v-onix-04",
        category: ExpenseCategory.MANUTENCAO_MECANICA,
        description: "Troca de 2 pneus dianteiros e alinhamento",
        partsCost: 800,
        laborCost: 150,
        amount: 950,
        expenseDate: "2026-08-03",
        supplierName: "PneuCenter Express",
      },
    ],
    totalPartsCost: 800,
    totalLaborCost: 150,
    totalOtherCost: 0,
    totalExpensesCost: 950,
    totalAccumulatedCost: 58950,
  },
];

const INITIAL_GENERAL_EXPENSES: GeneralExpenseItem[] = [
  {
    id: "gexp-01",
    garageId: "g-alpha-motors-01",
    category: "ALUGUEL_CONDOMINIO",
    description: "Aluguel do Pátio Principal e Showroom",
    amount: 4500,
    dueDate: "2026-09-05",
    isRecurring: true,
    isPaid: true,
  },
  {
    id: "gexp-02",
    garageId: "g-alpha-motors-01",
    category: "MARKETING_ANUNCIOS",
    description: "Plano Profissional Webmotors + iCarros",
    amount: 2200,
    dueDate: "2026-09-10",
    isRecurring: true,
    isPaid: false,
  },
  {
    id: "gexp-03",
    garageId: "g-alpha-motors-01",
    category: "SISTEMAS_SOFTWARES",
    description: "Assinatura Software de Gestão CarZ",
    amount: 350,
    dueDate: "2026-09-15",
    isRecurring: true,
    isPaid: false,
  },
];

const INITIAL_SALES: SaleItem[] = [
  {
    id: "sale-01",
    garageId: "g-alpha-motors-01",
    vehicleId: "v-onix-04",
    vehicleName: "Chevrolet Onix LTZ 1.0 Turbo Aut. 2020",
    plate: "SPX1E22",
    customerName: "Carlos Eduardo Silva",
    saleDate: "2026-08-15",
    finalSalePrice: 68000,
    paymentMethod: PaymentMethod.A_VISTA_PIX,
    totalAccumulatedCost: 58950,
    grossProfit: 9050,
    netProfit: 7750,
    hasTradeIn: false,
  },
];

const GarageContext = createContext<GarageContextType | undefined>(undefined);

function recalculateVehicleCosts(v: VehicleItem): VehicleItem {
  const totalParts = v.expenses.reduce((acc, e) => acc + (Number(e.partsCost) || 0), 0);
  const totalLabor = v.expenses.reduce((acc, e) => acc + (Number(e.laborCost) || 0), 0);
  const totalOther = v.expenses.reduce((acc, e) => {
    const partsAndLabor = (Number(e.partsCost) || 0) + (Number(e.laborCost) || 0);
    const remainder = Number(e.amount) - partsAndLabor;
    return acc + (remainder > 0 ? remainder : 0);
  }, 0);
  const totalExpenses = v.expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const totalAccumulated = Number(v.acquisitionPrice) + totalExpenses;

  return {
    ...v,
    totalPartsCost: totalParts,
    totalLaborCost: totalLabor,
    totalOtherCost: totalOther,
    totalExpensesCost: totalExpenses,
    totalAccumulatedCost: totalAccumulated,
  };
}

export function GarageProvider({
  children,
  initialSlug = "alpha-motors",
}: {
  children: React.ReactNode;
  initialSlug?: string;
}) {
  const [availableGarages] = useState<GarageInfo[]>(DEFAULT_GARAGES);
  const [currentGarage, setCurrentGarage] = useState<GarageInfo>(
    DEFAULT_GARAGES.find((g) => g.slug === initialSlug) || DEFAULT_GARAGES[0]
  );
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [generalExpenses, setGeneralExpenses] = useState<GeneralExpenseItem[]>(INITIAL_GENERAL_EXPENSES);
  const [sales, setSales] = useState<SaleItem[]>(INITIAL_SALES);
  const [loading, setLoading] = useState(false);

  // Load from local storage or backend if available
  useEffect(() => {
    const saved = localStorage.getItem(`carz_vehicles_${currentGarage.id}`);
    if (saved) {
      try {
        setVehicles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved vehicles", e);
      }
    }
  }, [currentGarage.id]);

  const saveVehiclesState = (updated: VehicleItem[]) => {
    setVehicles(updated);
    try {
      localStorage.setItem(`carz_vehicles_${currentGarage.id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  };

  const switchGarage = (slug: string) => {
    const found = availableGarages.find((g) => g.slug === slug);
    if (found) {
      setCurrentGarage(found);
    }
  };

  const addVehicle = async (data: Partial<VehicleItem>): Promise<VehicleItem> => {
    const newVehicle: VehicleItem = {
      id: `v-${Date.now()}`,
      garageId: currentGarage.id,
      plate: data.plate?.toUpperCase().trim() || "SEM-PLACA",
      vin: data.vin || "",
      renavam: data.renavam || "",
      brand: data.brand || "Desconhecida",
      model: data.model || "Modelo",
      version: data.version || "Versão",
      yearManufacture: Number(data.yearManufacture) || 2023,
      yearModel: Number(data.yearModel) || 2023,
      color: data.color || "Branco",
      mileageCurrent: Number(data.mileageCurrent) || 0,
      status: data.status || VehicleStatus.PREPARACAO,
      acquisitionType: data.acquisitionType || VehicleAcquisitionType.COMPRA_DIRETA_PF,
      acquisitionDate: data.acquisitionDate || new Date().toISOString().split("T")[0],
      acquisitionPrice: Number(data.acquisitionPrice) || 0,
      fipeCode: data.fipeCode,
      fipePriceAtAcquisition: Number(data.fipePriceAtAcquisition) || 0,
      fipeReferenceMonth: data.fipeReferenceMonth || "Setembro de 2026",
      targetSalePrice: Number(data.targetSalePrice) || Number(data.acquisitionPrice) * 1.2,
      minimumSalePrice: Number(data.minimumSalePrice) || Number(data.acquisitionPrice) * 1.1,
      notes: data.notes || "",
      expenses: [],
      totalPartsCost: 0,
      totalLaborCost: 0,
      totalOtherCost: 0,
      totalExpensesCost: 0,
      totalAccumulatedCost: Number(data.acquisitionPrice) || 0,
    };

    const updated = [newVehicle, ...vehicles];
    saveVehiclesState(updated);
    return newVehicle;
  };

  const addVehicleExpense = (
    vehicleId: string,
    data: {
      category: ExpenseCategory;
      description: string;
      partsCost: number;
      laborCost: number;
      otherCost?: number;
      supplierName?: string;
    }
  ) => {
    const partsCost = Number(data.partsCost) || 0;
    const laborCost = Number(data.laborCost) || 0;
    const otherCost = Number(data.otherCost) || 0;
    const amount = partsCost + laborCost + otherCost;

    const newExpense: VehicleExpenseItem = {
      id: `exp-${Date.now()}`,
      vehicleId,
      category: data.category,
      description: data.description,
      partsCost,
      laborCost,
      amount,
      expenseDate: new Date().toISOString().split("T")[0],
      supplierName: data.supplierName || "Fornecedor Local",
    };

    const updated = vehicles.map((v) => {
      if (v.id === vehicleId) {
        const withNewExpense = {
          ...v,
          expenses: [newExpense, ...v.expenses],
        };
        return recalculateVehicleCosts(withNewExpense);
      }
      return v;
    });

    saveVehiclesState(updated);
  };

  const updateVehicleStatus = (vehicleId: string, newStatus: VehicleStatus, notes?: string) => {
    const updated = vehicles.map((v) => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: newStatus,
          notes: notes ? `${v.notes ? v.notes + "\n" : ""}${notes}` : v.notes,
        };
      }
      return v;
    });
    saveVehiclesState(updated);
  };

  const sellVehicle = (
    vehicleId: string,
    saleData: {
      customerName: string;
      finalSalePrice: number;
      paymentMethod: PaymentMethod;
      salesCommission?: number;
      notes?: string;
      tradeIn?: {
        brand: string;
        model: string;
        version: string;
        yearManufacture: number;
        yearModel: number;
        plate: string;
        color: string;
        mileage: number;
        agreedValue: number;
      };
    }
  ) => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    if (!targetVehicle) return;

    const finalSalePrice = Number(saleData.finalSalePrice);
    const accumulatedCost = Number(targetVehicle.totalAccumulatedCost);
    const commission = Number(saleData.salesCommission) || 0;
    const grossProfit = finalSalePrice - accumulatedCost;
    const netProfit = grossProfit - commission;

    const newSale: SaleItem = {
      id: `sale-${Date.now()}`,
      garageId: currentGarage.id,
      vehicleId,
      vehicleName: `${targetVehicle.brand} ${targetVehicle.model} ${targetVehicle.version} ${targetVehicle.yearModel}`,
      plate: targetVehicle.plate,
      customerName: saleData.customerName,
      saleDate: new Date().toISOString().split("T")[0],
      finalSalePrice,
      paymentMethod: saleData.paymentMethod,
      totalAccumulatedCost: accumulatedCost,
      grossProfit,
      netProfit,
      hasTradeIn: !!saleData.tradeIn,
      tradeInVehiclePlate: saleData.tradeIn?.plate,
    };

    setSales([newSale, ...sales]);

    // Update vehicle to VENDIDO
    let updatedVehicles = vehicles.map((v) => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: VehicleStatus.VENDIDO,
        };
      }
      return v;
    });

    // If Trade-in vehicle provided, automatically insert it into PREPARACAO
    if (saleData.tradeIn) {
      const tradeIn = saleData.tradeIn;
      const tradeInVehicle: VehicleItem = {
        id: `v-tradein-${Date.now()}`,
        garageId: currentGarage.id,
        plate: tradeIn.plate.toUpperCase().trim(),
        vin: `TRADEIN${Date.now()}`,
        renavam: "00000000000",
        brand: tradeIn.brand,
        model: tradeIn.model,
        version: tradeIn.version,
        yearManufacture: Number(tradeIn.yearManufacture),
        yearModel: Number(tradeIn.yearModel),
        color: tradeIn.color || "Prata",
        mileageCurrent: Number(tradeIn.mileage) || 0,
        status: VehicleStatus.PREPARACAO, // Enters Stage 1: Preparação
        acquisitionType: VehicleAcquisitionType.TROCA_TRADE_IN,
        acquisitionDate: new Date().toISOString().split("T")[0],
        acquisitionPrice: Number(tradeIn.agreedValue),
        targetSalePrice: Number(tradeIn.agreedValue) * 1.25,
        notes: `Entrada na troca pela venda do veículo ${targetVehicle.model} (${targetVehicle.plate}) para ${saleData.customerName}.`,
        expenses: [],
        totalPartsCost: 0,
        totalLaborCost: 0,
        totalOtherCost: 0,
        totalExpensesCost: 0,
        totalAccumulatedCost: Number(tradeIn.agreedValue),
      };
      updatedVehicles = [tradeInVehicle, ...updatedVehicles];
    }

    saveVehiclesState(updatedVehicles);
  };

  const addGeneralExpense = (data: Omit<GeneralExpenseItem, "id" | "garageId" | "isPaid">) => {
    const newExp: GeneralExpenseItem = {
      id: `gexp-${Date.now()}`,
      garageId: currentGarage.id,
      ...data,
      isPaid: false,
    };
    setGeneralExpenses([newExp, ...generalExpenses]);
  };

  return (
    <GarageContext.Provider
      value={{
        garage: currentGarage,
        availableGarages,
        vehicles,
        generalExpenses,
        sales,
        loading,
        switchGarage,
        addVehicle,
        addVehicleExpense,
        updateVehicleStatus,
        sellVehicle,
        addGeneralExpense,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error("useGarage must be used within a GarageProvider");
  }
  return context;
}
