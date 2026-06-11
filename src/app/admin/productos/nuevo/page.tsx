export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/productos"
          className="mb-2 flex items-center gap-1 text-sm text-[#B8A79B] hover:text-[#6E5C52]"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a productos
        </Link>
        <h1 className="text-2xl font-semibold text-[#6E5C52]">Nuevo producto</h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
