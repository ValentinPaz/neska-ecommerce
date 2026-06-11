"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import { formatPrice, formatInstallments } from "@/lib/utils";

export function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#F9F7F4] border-[#DCCBB8] flex flex-col p-0"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-[#DCCBB8]">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-xl text-[#6E5C52] tracking-widest uppercase">
              Mi Carrito
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-[#B8A79B]">
                  ({items.length} {items.length === 1 ? "artículo" : "artículos"})
                </span>
              )}
            </SheetTitle>
            <button
              onClick={() => setCartOpen(false)}
              className="text-[#B8A79B] hover:text-[#6E5C52] transition-colors"
              aria-label="Cerrar carrito"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
              <ShoppingBag size={48} strokeWidth={1} className="text-[#DCCBB8]" />
              <p className="font-heading text-lg text-[#B8A79B] tracking-wide">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-[#B8A79B]">
                Explorá nuestra colección y encontrá tu próxima prenda favorita.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-2 px-6 py-2.5 border border-[#C8A86B] text-[#C8A86B] text-xs tracking-widest uppercase hover:bg-[#C8A86B] hover:text-white transition-colors rounded"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                {/* Imagen */}
                <div className="relative w-20 h-24 shrink-0 bg-[#F3E6E6] rounded overflow-hidden">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading text-[#B8A79B] text-2xl opacity-40">N</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#6E5C52] leading-snug line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[#B8A79B] mt-0.5">Talle: {item.size}</p>
                  <p className="text-sm font-bold text-[#6E5C52] mt-1">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>

                  {/* Cantidad + Eliminar */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-[#DCCBB8] rounded">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#6E5C52] hover:bg-[#F3E6E6] transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-sm text-[#6E5C52]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#6E5C52] hover:bg-[#F3E6E6] transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="text-[#B8A79B] hover:text-red-400 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con total */}
        {items.length > 0 && (
          <div className="border-t border-[#DCCBB8] px-5 py-5 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#B8A79B]">Subtotal</span>
              <span className="font-bold text-[#6E5C52] text-lg">{formatPrice(total())}</span>
            </div>
            <p className="text-xs text-[#B8A79B]">{formatInstallments(total())}</p>
            <Separator className="bg-[#DCCBB8]" />
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full text-center py-3.5 bg-[#C8A86B] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#b5945a] transition-colors rounded"
            >
              Ir al Checkout
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="block w-full text-center py-2 text-xs tracking-widest uppercase text-[#B8A79B] hover:text-[#6E5C52] transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
