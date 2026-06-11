export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

export default async function EditarCategoriaPage({ params }: Params) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) notFound();

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
        <h1 className="text-2xl font-semibold text-[#6E5C52]">Editar: {category.name}</h1>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
