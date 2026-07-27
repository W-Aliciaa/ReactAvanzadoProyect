import { z } from "zod";

export const projectTitleSchema = z
  .string()
  .trim()
  .min(3, "El título debe tener al menos 3 caracteres.")
  .max(80, "El título no puede superar 80 caracteres.");

export const projectSchema = z.object({
  title: projectTitleSchema,
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(500, "La descripción no puede superar 500 caracteres."),
});
