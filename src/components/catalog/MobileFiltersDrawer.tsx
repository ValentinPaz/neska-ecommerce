"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./FilterSidebar";
import type { Category } from "@/types";

interface MobileFiltersDrawerProps {
  categories: Category[];
  activeCategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function MobileFiltersDrawer(props: MobileFiltersDrawerProps) {
  const [open, setOpen] = useState(false);
  const activeCount = [props.activeCategory, props.minPrice, props.maxPrice].filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center gap-2 px-4 py-2 border border-[#DCCBB8] rounded text-sm text-[#6E5C52] hover:border-[#C8A86B] hover:text-[#C8A86B] transition-colors bg-white">
        <SlidersHorizontal size={15} strokeWidth={1.5} />
        Filtros
        {activeCount > 0 && (
          <span className="bg-[#C8A86B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#F9F7F4] border-[#DCCBB8] w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#6E5C52] tracking-widest uppercase text-sm">
            Filtros
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
