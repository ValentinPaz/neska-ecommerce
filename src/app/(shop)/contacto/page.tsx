import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contacto | NESKA Bs As",
  description: "Contactate con NESKA Bs As. Te respondemos a la brevedad.",
};

export default function ContactoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Info */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C8A86B] mb-3">
              Estamos para ayudarte
            </p>
            <h1 className="font-heading text-4xl font-bold text-[#6E5C52] tracking-wide uppercase leading-tight">
              Contacto
            </h1>
          </div>

          <p className="text-sm text-[#6E5C52]/80 leading-relaxed">
            ¿Tenés dudas sobre talles, disponibilidad o envíos? Completá el formulario y te
            respondemos a la brevedad.
          </p>

          <div className="space-y-5">
            {[
              {
                label: "Horario de atención",
                value: "Lunes a viernes · 10 a 18 hs",
              },
              {
                label: "Instagram",
                value: "@neska.bsas",
              },
              {
                label: "Envíos",
                value: "A todo el país · Gratis desde $150.000",
              },
              {
                label: "Cambios",
                value: "Sin cargo hasta 30 días de la compra",
              },
            ].map(({ label, value }) => (
              <div key={label} className="border-b border-[#DCCBB8] pb-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8A79B] mb-1">
                  {label}
                </p>
                <p className="text-sm text-[#6E5C52]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded border border-[#DCCBB8] p-8">
          <h2 className="font-heading text-xl text-[#6E5C52] tracking-wide uppercase mb-6">
            Envianos un mensaje
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
