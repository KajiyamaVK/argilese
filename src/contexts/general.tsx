'use client'
import { IProduct } from '@/models/products'
import { ReactNode, createContext, useState } from 'react'

interface IGeneralContext {
  cart: IProduct[]
  addToCart: (product: IProduct) => void
  removeFromCart: (productId: number) => void
}

export const GeneralContext = createContext({} as IGeneralContext)

export function GeneralProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<IProduct[]>([])

  function addToCart(product: IProduct) {
    setCart([...cart, product])
  }

  function removeFromCart(productId: number) {
    const newCart = cart.filter((product) => product.id !== productId)
    setCart(newCart)
  }

  return <GeneralContext.Provider value={{ cart, addToCart, removeFromCart }}>{children}</GeneralContext.Provider>
}
