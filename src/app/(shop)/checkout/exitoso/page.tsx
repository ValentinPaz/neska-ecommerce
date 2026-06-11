import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { ClearCart } from "@/components/cart/ClearCart";

export default function CheckoutExitosoPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <ClearCart />
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-emerald-500" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#6E5C52] tracking-wide uppercase mb-2">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-[#B8A79B]">
            Tu pago fue aprobado. Te enviaremos un mail con los detalles del pedido.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/catalogo"
            className="px-6 py-3 bg-[#C8A86B] text-white text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-[#DCCBB8] text-[#6E5C52] text-xs tracking-widest uppercase rounded-xl hover:bg-[#F9F7F4] transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
