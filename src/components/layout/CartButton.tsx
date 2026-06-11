"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";

export function CartButton() {
  const itemCount = useCartStore((s) => s.itemCount());
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative flex flex-col items-center gap-0.5 text-[#6E5C52] hover:text-[#C8A86B] transition-colors"
      aria-label="Abrir carrito"
    >
      <span className="relative">
        <ShoppingBag size={22} strokeWidth={1.5} />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#C8A86B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
            {itemCount}
          </span>
        )}
      </span>
      <span className="text-[10px] tracking-wider uppercase hidden md:block">Mi carrito</span>
    </button>
  );
}
