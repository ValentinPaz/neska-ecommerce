export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, Tag, Package, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, lowStockCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.productVariant.count({ where: { stock: { lte: 3 } } }),
  ]);

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      variants: true,
    },
  });

  const stats = [
    { label: "Productos activos", value: productCount, icon: ShoppingBag, href: "/admin/productos" },
    { label: "Categorías", value: categoryCount, icon: Tag, href: "/admin/categorias" },
    { label: "Talles con poco stock", value: lowStockCount, icon: Package, color: "text-orange-500", href: "/admin/productos" },
    { label: "Órdenes (próximamente)", value: "—", icon: TrendingUp, href: "#" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#6E5C52]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#B8A79B]">Resumen general de NESKA Bs As</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8] transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#B8A79B]">{label}</p>
                <p className={`mt-2 text-3xl font-bold ${color ?? "text-[#6E5C52]"}`}>{value}</p>
              </div>
              <div className="rounded-xl bg-[#F9F7F4] p-3">
                <Icon className="h-5 w-5 text-[#C8A86B]" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      <div className="rounded-2xl bg-white ring-1 ring-[#DCCBB8]">
        <div className="flex items-center justify-between border-b border-[#DCCBB8] px-6 py-4">
          <h2 className="font-semibold text-[#6E5C52]">Productos recientes</h2>
          <Link href="/admin/productos/nuevo" className="text-sm text-[#C8A86B] hover:underline">
            + Nuevo producto
          </Link>
        </div>
        <div className="divide-y divide-[#DCCBB8]">
          {recentProducts.map((p) => {
            const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
            return (
              <div key={p.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-[#6E5C52]">{p.name}</p>
                  <p className="text-xs text-[#B8A79B]">{p.category.name}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[#6E5C52]">
                    ${p.price.toLocaleString("es-AR")}
                  </span>
                  <span className={totalStock <= 5 ? "text-orange-500" : "text-emerald-600"}>
                    {totalStock} uds.
                  </span>
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="rounded-lg bg-[#F9F7F4] px-3 py-1 text-xs font-medium text-[#6E5C52] hover:bg-[#DCCBB8]"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
