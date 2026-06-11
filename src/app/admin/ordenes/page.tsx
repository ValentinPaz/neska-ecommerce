import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  CANCELLED: "Cancelado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-600",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
};

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function OrdenesPage({ searchParams }: Props) {
  const { status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const take = 20;

  const where = status ? { status: status as never } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { _count: { select: { items: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  const pages = Math.ceil(total / take);

  const statuses = ["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "CANCELLED", "REJECTED"];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Órdenes</h1>
        <span className="text-sm text-white/50">{total} en total</span>
      </div>

      {/* Filtro por estado */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/ordenes"
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            !status ? "bg-[#C8A86B] text-white" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
          }`}
        >
          Todas
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/ordenes?status=${s}`}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              status === s ? "bg-[#C8A86B] text-white" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
            }`}
          >
            {STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-[#242424] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Items</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Fecha</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-white/40">
                  No hay órdenes
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-white/60">
                  {order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-white font-medium">{order.customerName}</td>
                <td className="px-4 py-3 text-white/60 hidden md:table-cell">{order.customerEmail}</td>
                <td className="px-4 py-3 text-white/60 hidden sm:table-cell">{order._count.items}</td>
                <td className="px-4 py-3 text-right text-white font-medium">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-semibold ${STATUS_COLOR[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/40 text-xs hidden lg:table-cell">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/ordenes/${order.id}`}
                    className="text-xs text-[#C8A86B] hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/ordenes?${status ? `status=${status}&` : ""}page=${p}`}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
                p === page ? "bg-[#C8A86B] text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
