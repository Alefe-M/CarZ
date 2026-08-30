import prisma from "../prisma";
import { CreateVehicleInput } from "../validations/vehicle.schema";
import { VehicleStatus } from "@prisma/client";
import { calculateDirectCost, calculateFipeDiscount } from "../calculations";
import Decimal from "decimal.js";

export class VehicleService {
  /**
   * 1. Lista veículos da garagem com filtros e contagem por etapa
   */
  static async listVehicles(
    garageId: string,
    filters?: {
      status?: VehicleStatus;
      search?: string;
    }
  ) {
    const where: any = { garageId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      const search = filters.search.trim();
      where.OR = [
        { plate: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { vin: { contains: search, mode: "insensitive" } },
      ];
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        expenses: true,
        sale: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Enriquece cada veículo com seu custo acumulado calculado em tempo real
    return vehicles.map((vehicle) => {
      const totalCost = calculateDirectCost(
        vehicle.acquisitionPrice,
        vehicle.expenses
      );

      const fipeDiscount = vehicle.fipePriceAtAcquisition
        ? calculateFipeDiscount(vehicle.acquisitionPrice, vehicle.fipePriceAtAcquisition)
        : null;

      return {
        ...vehicle,
        totalAccumulatedCost: totalCost,
        fipeDiscountPercentage: fipeDiscount,
        expenseCount: vehicle.expenses.length,
      };
    });
  }

  /**
   * 2. Obtém a ficha técnica completa e dossiê financeiro do veículo
   */
  static async getVehicleById(garageId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        garageId,
      },
      include: {
        expenses: {
          include: {
            createdByUser: { select: { id: true, name: true } },
            supplier: true,
          },
          orderBy: { expenseDate: "desc" },
        },
        stockMovements: {
          include: {
            part: true,
            performedByUser: { select: { id: true, name: true } },
          },
          orderBy: { movementDate: "desc" },
        },
        sale: {
          include: {
            customer: true,
            sellerUser: { select: { id: true, name: true } },
            tradeInVehicle: true,
          },
        },
        supplier: true,
      },
    });

    if (!vehicle) {
      throw new Error("Veículo não encontrado nesta garagem.");
    }

    const totalCost = calculateDirectCost(
      vehicle.acquisitionPrice,
      vehicle.expenses
    );

    const fipeDiscount = vehicle.fipePriceAtAcquisition
      ? calculateFipeDiscount(vehicle.acquisitionPrice, vehicle.fipePriceAtAcquisition)
      : null;

    // Resumo de despesas por categoria
    const expensesByCategory = vehicle.expenses.reduce((acc, exp) => {
      const cat = exp.category;
      acc[cat] = (acc[cat] || 0) + new Decimal(exp.amount).toNumber();
      return acc;
    }, {} as Record<string, number>);

    return {
      ...vehicle,
      totalAccumulatedCost: totalCost,
      fipeDiscountPercentage: fipeDiscount,
      expensesByCategory,
    };
  }

  /**
   * 3. Cadastra nova entrada de veículo (inicia na etapa PREPARACAO)
   */
  static async createVehicle(garageId: string, input: CreateVehicleInput) {
    const existing = await prisma.vehicle.findFirst({
      where: {
        garageId,
        OR: [{ plate: input.plate }, { vin: input.vin }],
      },
    });

    if (existing) {
      throw new Error("Já existe um veículo cadastrado com esta Placa ou Chassi nesta garagem.");
    }

    return prisma.vehicle.create({
      data: {
        garageId,
        plate: input.plate,
        vin: input.vin,
        renavam: input.renavam,
        brand: input.brand,
        model: input.model,
        version: input.version,
        yearManufacture: input.yearManufacture,
        yearModel: input.yearModel,
        color: input.color,
        fuelType: input.fuelType,
        transmission: input.transmission,
        mileageIn: input.mileageIn,
        mileageCurrent: input.mileageIn,
        status: VehicleStatus.PREPARACAO, // 1ª etapa: sempre inicia em PREPARACAO
        acquisitionType: input.acquisitionType,
        acquisitionDate: new Date(input.acquisitionDate),
        acquisitionPrice: new Decimal(input.acquisitionPrice),
        fipeCode: input.fipeCode,
        fipePriceAtAcquisition: input.fipePriceAtAcquisition
          ? new Decimal(input.fipePriceAtAcquisition)
          : null,
        fipeReferenceMonth: input.fipeReferenceMonth,
        targetSalePrice: input.targetSalePrice
          ? new Decimal(input.targetSalePrice)
          : null,
        minimumSalePrice: input.minimumSalePrice
          ? new Decimal(input.minimumSalePrice)
          : null,
        supplierId: input.supplierId,
        notes: input.notes,
      },
    });
  }

  /**
   * 4. Altera a etapa do veículo (PREPARACAO -> A_VENDA -> VENDIDO)
   */
  static async updateVehicleStatus(
    garageId: string,
    vehicleId: string,
    newStatus: VehicleStatus,
    notes?: string
  ) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, garageId },
    });

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: newStatus,
        notes: notes ? `${vehicle.notes || ""}\n[Status -> ${newStatus}]: ${notes}` : vehicle.notes,
      },
    });
  }
}

