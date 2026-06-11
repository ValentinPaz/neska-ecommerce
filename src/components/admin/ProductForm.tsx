"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { productSchema, type ProductFormData } from "@/lib/validations/product";

interface Category {
  id: string;
  name: string;
}

interface Variant {
  id?: string;
  size: string;
  stock: number;
}

interface ProductWithImages extends Partial<ProductFormData> {
  id?: string;
  images?: { id: string; url: string }[];
  variants?: Variant[];
}

interface ProductFormProps {
  product?: ProductWithImages;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [images, setImages] = useState<{ id?: string; url: string }[]>(
    product?.images ?? []
  );
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? (0 as number),
      categoryId: product?.categoryId ?? "",
      isNew: product?.isNew ?? false,
      isActive: product?.isActive !== undefined ? product.isActive : true,
      variants: product?.variants?.map((v) => ({ id: v.id, size: v.size, stock: v.stock })) ?? ([] as ProductFormData["variants"]),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  // Auto-generate slug from name
  const nameValue = watch("name");
  useEffect(() => {
    if (!product?.id) {
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
  }, [nameValue, product?.id, setValue]);

  async function uploadImage(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setImages((prev) => [...prev, { url: data.url }]);
  }

  async function onSubmit(data: ProductFormData) {
    setServerError("");
    const isEdit = !!product?.id;
    const url = isEdit ? `/api/admin/productos/${product!.id}` : "/api/admin/productos";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        images: images.map((img, i) => ({ url: img.url, position: i })),
      }),
    });

    if (res.ok) {
      router.push("/admin/productos");
      router.refresh();
    } else {
      const json = await res.json();
      setServerError(json.error ?? "Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic info */}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8]">
        <h2 className="mb-5 font-semibold text-[#6E5C52]">Información básica</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label">Nombre</label>
            <input {...register("name")} className="field-input" placeholder="Blusa Satén Rosa" />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="field-label">Slug</label>
            <input {...register("slug")} className="field-input font-mono text-xs" placeholder="blusa-saten-rosa" />
            {errors.slug && <p className="field-error">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="field-label">Categoría</label>
            <select {...register("categoryId")} className="field-input">
              <option value="">Seleccionar...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="field-error">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="field-label">Precio (ARS)</label>
            <input {...register("price", { valueAsNumber: true })} type="number" className="field-input" placeholder="39800" />
            {errors.price && <p className="field-error">{errors.price.message}</p>}
          </div>

          <div>
            <label className="field-label">Descripción</label>
            <textarea {...register("description")} rows={3} className="field-input resize-none" placeholder="Descripción del producto..." />
          </div>

          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#6E5C52]">
              <input {...register("isNew")} type="checkbox" className="h-4 w-4 rounded border-[#DCCBB8] accent-[#C8A86B]" />
              Nuevo
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#6E5C52]">
              <input {...register("isActive")} type="checkbox" className="h-4 w-4 rounded border-[#DCCBB8] accent-[#C8A86B]" />
              Activo
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8]">
        <h2 className="mb-5 font-semibold text-[#6E5C52]">Imágenes</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-xl">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#DCCBB8] text-[#B8A79B] transition-colors hover:border-[#C8A86B] hover:text-[#C8A86B]">
            {uploading ? (
              <span className="text-xs">Subiendo...</span>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-xs">Subir</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {/* Variants / Stock */}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-[#DCCBB8]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-[#6E5C52]">Talles y stock</h2>
          <button
            type="button"
            onClick={() => append({ size: "", stock: 0 })}
            className="flex items-center gap-1.5 text-sm text-[#C8A86B] hover:underline"
          >
            <Plus className="h-4 w-4" />
            Agregar talle
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-3">
              <input
                {...register(`variants.${i}.size`)}
                placeholder="S / M / L / XL"
                className="field-input w-32"
              />
              <input
                {...register(`variants.${i}.stock`, { valueAsNumber: true })}
                type="number"
                placeholder="Stock"
                className="field-input w-28"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-lg p-1.5 text-[#B8A79B] hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-[#B8A79B]">Sin talles. Agregá al menos uno.</p>
          )}
        </div>
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="rounded-xl border border-[#DCCBB8] px-5 py-2.5 text-sm font-medium text-[#6E5C52] hover:bg-[#F9F7F4]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#C8A86B] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : product?.id ? "Actualizar producto" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
