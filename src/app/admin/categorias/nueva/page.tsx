import { CategoryForm } from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NuevaCategoriaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/categorias"
          className="mb-2 flex items-center gap-1 text-sm text-[#B8A79B] hover:text-[#6E5C52]"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a categorías
        </Link>
        <h1 className="text-2xl font-semibold text-[#6E5C52]">Nueva categoría</h1>
      </div>

      <CategoryForm />
    </div>
  );
}
