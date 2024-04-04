'use client'
import { GeneralContext } from '@/contexts/general'
import { IProduct } from '@/models/products'
import { useContext } from 'react'

interface AddToCartButtonProps {
  product: IProduct
}
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useContext(GeneralContext)
  return (
    <button
      type="button"
      className="mt-10 w-full rounded-md bg-yellow-700 p-2 text-white hover:opacity-75"
      onClick={() => addToCart(product)}
    >
      Adicionar ao carrinho
    </button>
  )
}
