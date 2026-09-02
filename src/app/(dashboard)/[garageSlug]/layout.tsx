"use client";

import React, { useState } from "react";
import { GarageProvider } from "@/context/GarageContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { SellVehicleModal } from "@/components/modals/SellVehicleModal";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { garageSlug: string };
}) {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [activeVehicleId, setActiveVehicleId] = useState<string | undefined>(undefined);

  const handleOpenExpense = (vehicleId?: string) => {
    setActiveVehicleId(vehicleId);
    setExpenseModalOpen(true);
  };

  const handleOpenSale = (vehicleId?: string) => {
    setActiveVehicleId(vehicleId);
    setSellModalOpen(true);
  };

  return (
    <GarageProvider initialSlug={params.garageSlug}>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar />

        {/* Main Content Shell */}
        <div className="flex flex-1 flex-col overflow-x-hidden">
          <Header
            onOpenExpenseModal={() => handleOpenExpense()}
            onOpenSaleModal={() => handleOpenSale()}
          />

          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav
            onOpenExpenseModal={() => handleOpenExpense()}
            onOpenSaleModal={() => handleOpenSale()}
          />
        </div>
      </div>

      {/* Global Modals */}
      <AddExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        defaultVehicleId={activeVehicleId}
      />

      <SellVehicleModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        defaultVehicleId={activeVehicleId}
      />
    </GarageProvider>
  );
}
