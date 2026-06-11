export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { take: 1, orderBy: { position: "asc" } },
      variants: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6E5C52]">Productos</h1>
          <p className="mt-1 text-sm text-[#B8A79B]">{products.length} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 rounded-xl bg-[#C8A86B] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-[#DCCBB8]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DCCBB8] text-left text-xs font-medium uppercase tracking-wide text-[#B8A79B]">
                <th className="px-6 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCCBB8]">
              {products.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-[#F9F7F4]/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-[#F9F7F4]" />
                        )}
                        <div>
                          <p className="font-medium text-[#6E5C52]">{p.name}</p>
                          <p className="text-xs text-[#B8A79B]">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6E5C52]">{p.category.name}</td>
                    <td className="px-4 py-3 text-[#6E5C52]">
                      ${p.price.toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={totalStock <= 5 ? "font-medium text-orange-500" : "text-[#6E5C52]"}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${p.id}`}
                          className="rounded-lg p-1.5 text-[#B8A79B] hover:bg-[#F9F7F4] hover:text-[#6E5C52]"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#B8A79B]">
                    No hay productos.{" "}
                    <Link href="/admin/productos/nuevo" className="text-[#C8A86B] hover:underline">
                      Crear el primero
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
