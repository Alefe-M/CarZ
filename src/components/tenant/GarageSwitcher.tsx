"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGarage } from "@/context/GarageContext";
import { ChevronDown, Building2, Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function GarageSwitcher({ className }: { className?: string }) {
  const { garage, availableGarages, switchGarage } = useGarage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-left shadow-sm hover:border-zinc-700 transition-all group"
      >
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-1.5">
              <span className="truncate text-xs font-semibold text-zinc-100">
                {garage.name}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-zinc-400">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>{garage.role}</span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:text-zinc-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[220px] rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95">
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Suas Garagens Conectadas
          </div>
          <div className="space-y-1">
            {availableGarages.map((item) => {
              const isSelected = item.id === garage.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    switchGarage(item.slug);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-zinc-800 text-zinc-100 font-medium"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                  )}
                >
                  <div className="truncate">
                    <div className="truncate font-medium">{item.name}</div>
                    <div className="text-[10px] text-zinc-500">{item.role}</div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
