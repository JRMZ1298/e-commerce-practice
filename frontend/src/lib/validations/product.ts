import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z.string().min(1, 'El slug es obligatorio'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, 'La categoría es obligatoria'),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        altText: z.string().optional(),
        isPrimary: z.boolean().default(false),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1),
        name: z.string().min(1),
        price: z.number().positive(),
        stock: z.number().int().nonnegative(),
      })
    )
    .optional(),
})

export type ProductInput = z.infer<typeof productSchema>
