import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  slug: z
    .string()
    .min(2, "El slug es requerido")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  description: z.string(),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  isNew: z.boolean(),
  isActive: z.boolean(),
  variants: z.array(
    z.object({
      id: z.string().optional(),
      size: z.string().min(1, "El talle es requerido"),
      stock: z.number().min(0, "El stock no puede ser negativo"),
    })
  ),
});

export const stockPatchSchema = z.object({
  variants: z.array(
    z.object({
      id: z.string().optional(),
      size: z.string().min(1),
      stock: z.number().min(0),
    })
  ),
});

export type ProductFormData = z.infer<typeof productSchema>;
