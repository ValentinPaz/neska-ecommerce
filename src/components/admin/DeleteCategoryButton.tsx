"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  id: string;
  name: string;
  productCount: number;
}

export function DeleteCategoryButton({ id, name, productCount }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (productCount > 0) {
      alert(`No podés eliminar "${name}" porque tiene ${productCount} producto(s) asociado(s).`);
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
    setLoading(true);
    await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading || productCount > 0}
      title={productCount > 0 ? `Tiene ${productCount} producto(s)` : "Eliminar"}
      className="rounded-lg p-1.5 text-[#B8A79B] hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
