"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    setServerError("");
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const json = await res.json();
      setServerError(json.error ?? "Error al iniciar sesión");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F7F4] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-[#C8A86B]">NESKA</h1>
          <p className="mt-1 text-sm text-[#B8A79B]">Panel de administración</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-[#DCCBB8]"
        >
          <h2 className="mb-6 text-lg font-semibold text-[#6E5C52]">Iniciar sesión</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#6E5C52]">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-[#DCCBB8] px-3 py-2.5 text-sm outline-none focus:border-[#C8A86B] focus:ring-2 focus:ring-[#C8A86B]/20"
                placeholder="admin@neska.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#6E5C52]">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#DCCBB8] px-3 py-2.5 text-sm outline-none focus:border-[#C8A86B] focus:ring-2 focus:ring-[#C8A86B]/20"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-[#C8A86B] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
