import { z } from "zod";

export const adTitleSchema = z
  .string()
  .trim()
  .min(3, "El título debe tener al menos 3 caracteres.")
  .max(80, "El título no puede superar 80 caracteres.");

export const adSchema = z.object({
  title: adTitleSchema,
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(500, "La descripción no puede superar 500 caracteres."),
    price: z.coerce.number().positive("El precio debe ser mayor a 0"),
    tags: z.string().transform((str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  ),
});
