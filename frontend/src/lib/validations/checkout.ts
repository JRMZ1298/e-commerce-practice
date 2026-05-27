import { z } from 'zod'

export const addressSchema = z.object({
  street: z.string().min(1, 'La calle es obligatoria'),
  streetNumber: z.string().optional(),
  city: z.string().min(1, 'La ciudad es obligatoria'),
  state: z.string().min(1, 'El estado es obligatorio'),
  postalCode: z
    .string()
    .min(5, 'Código postal inválido')
    .max(5, 'Código postal inválido'),
  country: z.string().length(2, 'País inválido').default('MX'),
  references: z.string().optional(),
})

export type AddressInput = z.infer<typeof addressSchema>
