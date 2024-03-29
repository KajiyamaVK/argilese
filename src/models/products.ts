import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  productName: z.string(),
  productDescription: z.string(),
  price: z.number(),
  productImages: z.string(),
  height: z.number(),
  width: z.number(),
  weight: z.number(),
  length: z.number(),
  isSold: z.boolean(),
})

export type IProduct = z.infer<typeof productSchema>
