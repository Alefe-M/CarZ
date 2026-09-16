import prisma from "../prisma";
import { CreateCustomerInput } from "../validations/customer.schema";

export class CustomerService {
  static async listCustomers(garageId: string) {
    return prisma.customer.findMany({ where: { garageId }, orderBy: { name: "asc" } });
  }

  static async createCustomer(garageId: string, input: CreateCustomerInput) {
    return prisma.customer.upsert({
      where: { garageId_documentCpfCnpj: { garageId, documentCpfCnpj: input.documentCpfCnpj } },
      update: { name: input.name, phone: input.phone, email: input.email || null, address: input.address, city: input.city, state: input.state },
      create: { garageId, name: input.name, documentCpfCnpj: input.documentCpfCnpj, phone: input.phone, email: input.email || null, address: input.address, city: input.city, state: input.state },
    });
  }
}
