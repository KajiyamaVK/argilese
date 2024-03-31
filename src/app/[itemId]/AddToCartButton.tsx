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
      className="bg-yellow-700 text-white p-2 rounded-md mt-10 hover:opacity-75 w-full"
      onClick={() => addToCart(product)}
    >
      Adicionar ao carrinho
    </button>
  )
}
