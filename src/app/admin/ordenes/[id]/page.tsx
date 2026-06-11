"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; slug: string };
  variant: { size: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  shippingCity: string | null;
  shippingZip: string | null;
  notes: string | null;
  mpPaymentId: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdenDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetch(`/api/admin/ordenes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setSelectedStatus(data.status);
        setLoading(false);
      });
  }, [id]);

  async function handleStatusUpdate() {
    if (!order || selectedStatus === order.status) return;
    setSaving(true);
    const res = await fetch(`/api/admin/ordenes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder((prev) => prev ? { ...prev, status: updated.status } : prev);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="p-8 text-white/50 text-sm">Cargando…</div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-white/50">Orden no encontrada.</p>
        <Link href="/admin/ordenes" className="text-[#C8A86B] text-sm hover:underline mt-2 inline-block">
          ← Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-white">
            Orden <span className="font-mono text-sm text-white/60">{order.id.slice(0, 8)}</span>
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            {new Date(order.createdAt).toLocaleString("es-AR")}
          </p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded text-xs font-semibold ${STATUS_COLOR[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cliente */}
        <div className="bg-[#242424] rounded-xl p-5 space-y-3">
          <h2 className="text-xs text-[#C8A86B] tracking-wider uppercase font-semibold mb-3">
            Cliente
          </h2>
          <p className="text-white font-medium">{order.customerName}</p>
          <p className="text-white/60 text-sm">{order.customerEmail}</p>
          {order.customerPhone && <p className="text-white/60 text-sm">{order.customerPhone}</p>}
          <div className="border-t border-white/10 pt-3 mt-3">
            <p className="text-xs text-white/40 mb-1">Dirección de envío</p>
            <p className="text-white/80 text-sm">{order.shippingAddress}</p>
            {(order.shippingCity || order.shippingZip) && (
              <p className="text-white/60 text-sm">
                {[order.shippingCity, order.shippingZip].filter(Boolean).join(" — ")}
              </p>
            )}
          </div>
          {order.notes && (
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="text-xs text-white/40 mb-1">Notas</p>
              <p className="text-white/60 text-sm italic">{order.notes}</p>
            </div>
          )}
          {order.mpPaymentId && (
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="text-xs text-white/40 mb-1">Pago MP</p>
              <p className="font-mono text-xs text-white/60">{order.mpPaymentId}</p>
            </div>
          )}
        </div>

        {/* Estado */}
        <div className="bg-[#242424] rounded-xl p-5">
          <h2 className="text-xs text-[#C8A86B] tracking-wider uppercase font-semibold mb-4">
            Actualizar estado
          </h2>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-[#1a1a1a] text-white border border-white/10 text-sm mb-4 focus:outline-none focus:border-[#C8A86B]"
          >
            {Object.entries(STATUS_LABEL).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={saving || selectedStatus === order.status}
            className="w-full py-2.5 bg-[#C8A86B] text-white text-sm font-medium rounded-lg hover:bg-[#b5945a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando…" : "Guardar cambio"}
          </button>
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-xs text-white/40 mb-1">Total de la orden</p>
            <p className="text-2xl font-semibold text-white">{formatPrice(order.total)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 bg-[#242424] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-xs text-[#C8A86B] tracking-wider uppercase font-semibold">
            Productos ({order.items.length})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
              <th className="text-left px-5 py-3">Producto</th>
              <th className="text-left px-5 py-3">Talle</th>
              <th className="text-right px-5 py-3">Precio unit.</th>
              <th className="text-right px-5 py-3">Cant.</th>
              <th className="text-right px-5 py-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-white/5">
                <td className="px-5 py-3 text-white">{item.product.name}</td>
                <td className="px-5 py-3 text-white/60">{item.variant.size}</td>
                <td className="px-5 py-3 text-right text-white/60">{formatPrice(item.unitPrice)}</td>
                <td className="px-5 py-3 text-right text-white/60">{item.quantity}</td>
                <td className="px-5 py-3 text-right text-white font-medium">
                  {formatPrice(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/10">
              <td colSpan={4} className="px-5 py-3 text-right text-sm font-medium text-white/60">
                Total
              </td>
              <td className="px-5 py-3 text-right text-white font-bold">
                {formatPrice(order.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
