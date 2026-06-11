import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-400" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#6E5C52] tracking-wide uppercase mb-2">
            Pago rechazado
          </h1>
          <p className="text-[#B8A79B]">
            No pudimos procesar tu pago. Podés intentarlo nuevamente o contactarnos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/checkout"
            className="px-6 py-3 bg-[#C8A86B] text-white text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            Intentar nuevamente
          </Link>
          <Link
            href="/contacto"
            className="px-6 py-3 border border-[#DCCBB8] text-[#6E5C52] text-xs tracking-widest uppercase rounded-xl hover:bg-[#F9F7F4] transition-colors"
          >
            Contactarnos
          </Link>
        </div>
      </div>
    </div>
  );
}
