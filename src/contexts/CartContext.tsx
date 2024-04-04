'use client'
import { IProduct } from '@/models/products'
import { ReactNode, createContext, useState } from 'react'

interface ICartContext {
  cart: IProduct[]
  addToCart: (product: IProduct) => void
  removeFromCart: (productId: number) => void

  resetCart: () => void
  checkIfAlreadyInCart: (productId: number) => boolean
}

export const CartContext = createContext({} as ICartContext)

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<IProduct[]>([])

  function addToCart(product: IProduct) {
    setCart([...cart, product])
  }

  function removeFromCart(productId: number) {
    const newCart = cart.filter((product) => product.id !== productId)

    setCart(newCart)
  }

  function checkIfAlreadyInCart(productId: number) {
    return cart.some((product) => product.id === productId)
  }

  function resetCart() {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, resetCart, checkIfAlreadyInCart }}>
      {children}
    </CartContext.Provider>
  )
}
