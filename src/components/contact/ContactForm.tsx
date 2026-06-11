"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

const schema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(false);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      reset();
    } catch {
      setServerError(true);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-[#C8A86B]/10 flex items-center justify-center">
          <Check size={28} className="text-[#C8A86B]" />
        </div>
        <h3 className="font-heading text-xl text-[#6E5C52] tracking-wide">
          ¡Mensaje recibido!
        </h3>
        <p className="text-sm text-[#B8A79B] max-w-xs">
          Te responderemos a la brevedad en el email que nos dejaste.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-xs tracking-widest uppercase text-[#C8A86B] underline underline-offset-2"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-xs tracking-wider uppercase text-[#6E5C52] mb-2">
          Nombre
        </label>
        <Input
          {...register("nombre")}
          placeholder="Tu nombre"
          className="border-[#DCCBB8] focus:border-[#C8A86B] bg-white text-[#6E5C52] placeholder:text-[#B8A79B]"
        />
        {errors.nombre && (
          <p className="text-xs text-red-400 mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs tracking-wider uppercase text-[#6E5C52] mb-2">
          Email
        </label>
        <Input
          {...register("email")}
          type="email"
          placeholder="tu@email.com"
          className="border-[#DCCBB8] focus:border-[#C8A86B] bg-white text-[#6E5C52] placeholder:text-[#B8A79B]"
        />
        {errors.email && (
          <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Mensaje */}
      <div>
        <label className="block text-xs tracking-wider uppercase text-[#6E5C52] mb-2">
          Mensaje
        </label>
        <Textarea
          {...register("mensaje")}
          placeholder="¿En qué te podemos ayudar?"
          rows={5}
          className="border-[#DCCBB8] focus:border-[#C8A86B] bg-white text-[#6E5C52] placeholder:text-[#B8A79B] resize-none"
        />
        {errors.mensaje && (
          <p className="text-xs text-red-400 mt-1">{errors.mensaje.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-xs text-red-400">
          Ocurrió un error. Por favor intentá de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#C8A86B] text-white text-xs tracking-[0.2em] uppercase font-semibold rounded hover:bg-[#b5945a] transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
