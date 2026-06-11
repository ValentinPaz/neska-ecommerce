"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const MAX_PRICE = 200000;

interface FilterSidebarProps {
  categories: Category[];
  activeCategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

function CategoryList({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: Category[];
  activeCategory?: string;
  onSelect: (slug: string | undefined) => void;
}) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect(undefined)}
        className={cn(
          "w-full text-left text-sm py-1.5 px-2 rounded transition-colors flex justify-between items-center",
          !activeCategory
            ? "text-[#C8A86B] font-semibold bg-[#C8A86B]/10"
            : "text-[#6E5C52] hover:text-[#C8A86B] hover:bg-[#F3E6E6]"
        )}
      >
        <span>Todas las categorías</span>
        <span className="text-xs text-[#B8A79B]">
          {categories.reduce((acc, c) => acc + c.count, 0)}
        </span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={cn(
            "w-full text-left text-sm py-1.5 px-2 rounded transition-colors flex justify-between items-center",
            activeCategory === cat.slug
              ? "text-[#C8A86B] font-semibold bg-[#C8A86B]/10"
              : "text-[#6E5C52] hover:text-[#C8A86B] hover:bg-[#F3E6E6]"
          )}
        >
          <span>{cat.name}</span>
          <span className="text-xs text-[#B8A79B]">{cat.count}</span>
        </button>
      ))}
    </div>
  );
}

function PriceFilter({
  minPrice,
  maxPrice,
  onApply,
}: {
  minPrice?: number;
  maxPrice?: number;
  onApply: (min: number | undefined, max: number | undefined) => void;
}) {
  const [localMin, setLocalMin] = useState(minPrice?.toString() ?? "");
  const [localMax, setLocalMax] = useState(maxPrice?.toString() ?? "");

  const handleApply = () => {
    const min = localMin ? Number(localMin) : undefined;
    const max = localMax ? Number(localMax) : undefined;
    onApply(min, max);
  };

  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    onApply(undefined, undefined);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] tracking-wider uppercase text-[#B8A79B] mb-1 block">
            Mínimo
          </label>
          <input
            type="number"
            placeholder="$0"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="w-full px-2.5 py-2 text-sm border border-[#DCCBB8] rounded bg-white text-[#6E5C52] placeholder:text-[#B8A79B] focus:outline-none focus:border-[#C8A86B] transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] tracking-wider uppercase text-[#B8A79B] mb-1 block">
            Máximo
          </label>
          <input
            type="number"
            placeholder={`$${MAX_PRICE.toLocaleString("es-AR")}`}
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="w-full px-2.5 py-2 text-sm border border-[#DCCBB8] rounded bg-white text-[#6E5C52] placeholder:text-[#B8A79B] focus:outline-none focus:border-[#C8A86B] transition-colors"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 py-2 bg-[#C8A86B] text-white text-xs tracking-widest uppercase rounded hover:bg-[#b5945a] transition-colors"
        >
          Aplicar
        </button>
        {(localMin || localMax) && (
          <button
            onClick={handleClear}
            className="px-3 py-2 border border-[#DCCBB8] text-[#B8A79B] text-xs rounded hover:border-[#C8A86B] hover:text-[#C8A86B] transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

export function FilterSidebar({
  categories,
  activeCategory,
  minPrice,
  maxPrice,
}: FilterSidebarProps) {
  const router = useRouter();

  const buildUrl = (params: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    const merged = {
      categoria: activeCategory,
      min: minPrice?.toString(),
      max: maxPrice?.toString(),
      ...params,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) search.set(k, v);
    });
    const qs = search.toString();
    return `/catalogo${qs ? `?${qs}` : ""}`;
  };

  const handleCategory = (slug: string | undefined) => {
    router.push(buildUrl({ categoria: slug, min: minPrice?.toString(), max: maxPrice?.toString() }));
  };

  const handlePrice = (min: number | undefined, max: number | undefined) => {
    router.push(buildUrl({ min: min?.toString(), max: max?.toString() }));
  };

  const hasActiveFilters = activeCategory || minPrice || maxPrice;

  return (
    <aside className="w-56 shrink-0 space-y-7">
      {/* Precio */}
      <div>
        <h3 className="text-[10px] tracking-[0.25em] uppercase text-[#C8A86B] font-semibold mb-3">
          Precio
        </h3>
        <PriceFilter minPrice={minPrice} maxPrice={maxPrice} onApply={handlePrice} />
      </div>

      <div className="border-t border-[#DCCBB8]" />

      {/* Categorías */}
      <div>
        <h3 className="text-[10px] tracking-[0.25em] uppercase text-[#C8A86B] font-semibold mb-3">
          Categorías
        </h3>
        <CategoryList
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleCategory}
        />
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <>
          <div className="border-t border-[#DCCBB8]" />
          <button
            onClick={() => router.push("/catalogo")}
            className="text-xs text-[#B8A79B] hover:text-[#C8A86B] transition-colors underline underline-offset-2"
          >
            Limpiar todos los filtros
          </button>
        </>
      )}
    </aside>
  );
}
