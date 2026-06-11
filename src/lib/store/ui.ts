"use client";

import { create } from "zustand";

interface UIStore {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
}));
