"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === product.id && i.size === size
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, size, quantity: 1 }] });
        }
      },

      removeItem: (productId, size) => {
        set({ items: get().items.filter((i) => !(i.product.id === productId && i.size === size)) });
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.size === size ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      total: () => get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    }),
    { name: "neska-cart" }
  )
);
