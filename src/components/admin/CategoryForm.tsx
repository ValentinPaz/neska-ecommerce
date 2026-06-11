"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/lib/validations/category";

interface CategoryFormProps {
  category?: { id: string; name: string; slug: string; position: number };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      position: category?.position ?? (0 as number),
    },
  });

  const nameValue = watch("name");
  useEffect(() => {
    if (!category?.id) {
      const slug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [nameValue, category?.id, setValue]);

  async function onSubmit(data: CategoryFormData) {
    setServerError("");
    const isEdit = !!category?.id;
    const url = isEdit ? `/api/admin/categorias/${category!.id}` : "/api/admin/categorias";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/categorias");
      router.refresh();
    } else {
      const json = await res.json();
      setServerError(json.error ?? "Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8]">
        <h2 className="mb-5 font-semibold text-[#6E5C52]">Datos de la categoría</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Nombre</label>
            <input {...register("name")} className="field-input" placeholder="Blusas" />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="field-label">Slug</label>
            <input {...register("slug")} className="field-input font-mono text-xs" placeholder="blusas" />
            {errors.slug && <p className="field-error">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="field-label">Posición (orden en menú)</label>
            <input {...register("position", { valueAsNumber: true })} type="number" className="field-input w-28" />
          </div>
        </div>

        {serverError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/categorias")}
            className="rounded-xl border border-[#DCCBB8] px-5 py-2.5 text-sm font-medium text-[#6E5C52] hover:bg-[#F9F7F4]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#C8A86B] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : category?.id ? "Actualizar" : "Crear categoría"}
          </button>
        </div>
      </div>
    </form>
  );
}
