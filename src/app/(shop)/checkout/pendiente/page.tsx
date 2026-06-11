import Link from "next/link";
import { Clock } from "lucide-react";

export default function CheckoutPendientePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <Clock className="h-16 w-16 text-amber-500" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#6E5C52] tracking-wide uppercase mb-2">
            Pago pendiente
          </h1>
          <p className="text-[#B8A79B]">
            Tu pago está siendo procesado. Te avisaremos por email cuando se confirme.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#C8A86B] text-white text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
