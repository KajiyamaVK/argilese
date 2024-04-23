'use client'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { IProduct } from '@/models/products'
import { useContext } from 'react'

interface AddToCartButtonProps {
  product: IProduct
}
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, checkIfAlreadyInCart } = useContext(PurchaseContext)
  const { sendAlert } = useContext(AlertDialogContext)

  function handleAddToCart() {
    if (checkIfAlreadyInCart(product.id))
      return sendAlert({
        message: `Ei! Bem que você queria comprar mais deste, né?! Produto ${product.productName} já está no carrinho. Por favor, verifique!`,
        type: 'error',
      })
    sendAlert({ message: `Produto ${product.productName} adicionado ao carrinho`, type: 'OK' })
    addToCart(product)
  }

  return (
    <button
      type="button"
      className="mt-10 w-full rounded-md bg-yellow-700 p-2 text-white hover:opacity-75"
      onClick={handleAddToCart}
    >
      Adicionar ao carrinho
    </button>
  )
}
