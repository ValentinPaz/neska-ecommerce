export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6E5C52]">Categorías</h1>
          <p className="mt-1 text-sm text-[#B8A79B]">{categories.length} categorías</p>
        </div>
        <Link
          href="/admin/categorias/nueva"
          className="flex items-center gap-2 rounded-xl bg-[#C8A86B] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Link>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-[#DCCBB8]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#DCCBB8] text-left text-xs font-medium uppercase tracking-wide text-[#B8A79B]">
              <th className="px-6 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Posición</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCCBB8]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#F9F7F4]/50">
                <td className="px-6 py-3 font-medium text-[#6E5C52]">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#B8A79B]">{c.slug}</td>
                <td className="px-4 py-3 text-[#6E5C52]">{c.position}</td>
                <td className="px-4 py-3 text-[#6E5C52]">{c._count.products}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categorias/${c.id}`}
                      className="rounded-lg p-1.5 text-[#B8A79B] hover:bg-[#F9F7F4] hover:text-[#6E5C52]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteCategoryButton id={c.id} name={c.name} productCount={c._count.products} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
