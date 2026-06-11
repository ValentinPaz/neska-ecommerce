"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import { formatPrice, formatInstallments } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <Badge
          variant="secondary"
          className="bg-[#F3E6E6] text-[#B8A79B] border-0 text-xs tracking-wide rounded-none"
        >
          {product.category.name}
        </Badge>
        {product.isNew && (
          <Badge className="bg-[#C8A86B] text-white border-0 text-xs tracking-wide rounded-none">
            Nuevo
          </Badge>
        )}
      </div>

      {/* Nombre */}
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#6E5C52] tracking-wide leading-tight uppercase">
        {product.name}
      </h1>

      {/* Precio */}
      <div className="space-y-1">
        <p className="text-3xl font-bold text-[#6E5C52]">{formatPrice(product.price)}</p>
        <p className="text-sm text-[#B8A79B]">{formatInstallments(product.price)}</p>
      </div>

      <div className="border-t border-[#DCCBB8]" />

      {/* Descripción */}
      <p className="text-sm text-[#6E5C52]/80 leading-relaxed">{product.description}</p>

      {/* Selector de talle */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs tracking-[0.2em] uppercase text-[#6E5C52] font-semibold">
            Talle
          </p>
          {sizeError && (
            <p className="text-xs text-red-400 animate-pulse">Seleccioná un talle</p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setSizeError(false); }}
              className={`min-w-[44px] h-11 px-3 border text-sm font-medium rounded transition-all ${
                selectedSize === size
                  ? "border-[#C8A86B] bg-[#C8A86B] text-white"
                  : sizeError
                  ? "border-red-300 text-[#6E5C52] hover:border-[#C8A86B]"
                  : "border-[#DCCBB8] text-[#6E5C52] hover:border-[#C8A86B] hover:text-[#C8A86B]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`flex items-center justify-center gap-2 w-full py-4 text-xs tracking-[0.2em] uppercase font-semibold rounded transition-all ${
            added
              ? "bg-green-500 text-white"
              : "bg-[#C8A86B] text-white hover:bg-[#b5945a]"
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              Agregado al carrito
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Agregar al carrito
            </>
          )}
        </button>
      </div>

      {/* Trust mini-badges */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#DCCBB8]">
        {[
          "Envío a todo el país",
          "3 cuotas sin interés",
          "Cambios sin cargo hasta 30 días",
        ].map((text) => (
          <div key={text} className="flex items-center gap-2 text-xs text-[#B8A79B]">
            <div className="w-1 h-1 rounded-full bg-[#C8A86B]" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
