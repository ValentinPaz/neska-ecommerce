import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  slug: z
    .string()
    .min(2, "El slug es requerido")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  position: z.number().min(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
