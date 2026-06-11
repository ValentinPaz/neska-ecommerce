"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCartStore();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) });

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-12 w-12 text-[#DCCBB8]" />
        <p className="text-[#B8A79B]">Tu carrito está vacío.</p>
        <Link href="/catalogo" className="text-sm text-[#C8A86B] hover:underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  async function onSubmit(data: CheckoutFormData) {
    setServerError("");

    const payload = {
      customer: data,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        size: i.size,
        price: i.product.price,
        quantity: i.quantity,
      })),
    };

    const res = await fetch("/api/checkout/preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const json = await res.json();
      setServerError(json.error ?? "Error al procesar el pago");
      return;
    }

    const { initPoint } = await res.json();
    window.location.href = initPoint;
  }

  const subtotal = total();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/catalogo"
          className="flex items-center gap-1 text-sm text-[#B8A79B] hover:text-[#6E5C52] mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Seguir comprando
        </Link>
        <h1 className="font-heading text-3xl font-bold text-[#6E5C52] tracking-wide uppercase">
          Finalizar compra
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Formulario — 3 columnas */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
          {/* Datos personales */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8]">
            <h2 className="mb-4 font-semibold text-[#6E5C52]">Datos personales</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label">Nombre completo</label>
                <input {...register("name")} className="field-input" placeholder="Ana García" />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>
              <div>
                <label className="field-label">Email</label>
                <input {...register("email")} type="email" className="field-input" placeholder="ana@email.com" />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>
              <div>
                <label className="field-label">Teléfono</label>
                <input {...register("phone")} className="field-input" placeholder="11 1234-5678" />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8]">
            <h2 className="mb-4 font-semibold text-[#6E5C52]">Dirección de envío</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label">Calle y número</label>
                <input {...register("address")} className="field-input" placeholder="Corrientes 1234, 3° B" />
                {errors.address && <p className="field-error">{errors.address.message}</p>}
              </div>
              <div>
                <label className="field-label">Ciudad</label>
                <input {...register("city")} className="field-input" placeholder="Buenos Aires" />
                {errors.city && <p className="field-error">{errors.city.message}</p>}
              </div>
              <div>
                <label className="field-label">Código postal</label>
                <input {...register("zip")} className="field-input" placeholder="1414" />
                {errors.zip && <p className="field-error">{errors.zip.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Notas (opcional)</label>
                <textarea
                  {...register("notes")}
                  rows={2}
                  className="field-input resize-none"
                  placeholder="Instrucciones para el envío..."
                />
              </div>
            </div>
          </div>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#C8A86B] py-4 text-sm font-semibold tracking-widest uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
          </button>

          <p className="text-center text-xs text-[#B8A79B]">
            Serás redirigido al sitio seguro de Mercado Pago para completar el pago.
          </p>
        </form>

        {/* Resumen — 2 columnas */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8] sticky top-6">
            <h2 className="mb-4 font-semibold text-[#6E5C52]">Tu pedido</h2>

            <div className="divide-y divide-[#DCCBB8]">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F3E6E6]">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#6E5C52] truncate">{item.product.name}</p>
                    <p className="text-xs text-[#B8A79B]">Talle {item.size} · ×{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#6E5C52] shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-[#DCCBB8] pt-4 text-sm">
              <div className="flex justify-between text-[#B8A79B]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#B8A79B]">
                <span>Envío</span>
                <span className="text-emerald-600">A coordinar</span>
              </div>
              <div className="flex justify-between font-bold text-[#6E5C52] text-base pt-2 border-t border-[#DCCBB8]">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-[#DCCBB8] pt-4">
              {["Pago 100% seguro", "3 cuotas sin interés", "Cambios sin cargo hasta 30 días"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-[#B8A79B]">
                  <div className="h-1 w-1 rounded-full bg-[#C8A86B]" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
