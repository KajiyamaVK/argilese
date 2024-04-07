'use client'
import { IProduct } from '@/models/products'
import { Dispatch, ReactNode, SetStateAction, createContext, useMemo, useState } from 'react'

interface ICartContext {
  cart: IProduct[]
  addToCart: (product: IProduct) => void
  removeFromCart: (productId: number) => void

  resetCart: () => void
  checkIfAlreadyInCart: (productId: number) => boolean
  totalCartQty: number
  totalCartItemsPrice: number
  currentStep: TStep
  setCurrentStep: Dispatch<SetStateAction<TStep>>
  deliveryPrice: number
  setDeliveryPrice: Dispatch<SetStateAction<number>>
  totalWeight: number
  totalHeight: number
  totalWidth: number
  totalLength: number
  totalPurchaseAmount: number
}
export type TStep = 'cart' | 'payment' | 'delivery'

export const CartContext = createContext({} as ICartContext)

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<IProduct[]>([])
  const [currentStep, setCurrentStep] = useState<TStep>('cart')
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0)

  const totalWeight = useMemo(() => cart.reduce((acc, product) => acc + product.weight, 0), [cart])
  const totalHeight = useMemo(() => cart.reduce((acc, product) => acc + product.height, 0), [cart])
  const totalWidth = useMemo(() => cart.reduce((acc, product) => acc + product.width, 0), [cart])
  const totalLength = useMemo(() => cart.reduce((acc, product) => acc + product.length, 0), [cart])
  const totalCartQty = useMemo(() => cart.length, [cart])
  const totalCartItemsPrice = useMemo(() => cart.reduce((acc, product) => acc + product.price, 0), [cart])
  const totalPurchaseAmount = useMemo(() => totalCartItemsPrice + deliveryPrice, [totalCartItemsPrice, deliveryPrice])

  function addToCart(product: IProduct) {
    setCart([...cart, product])
  }

  function removeFromCart(productId: number) {
    console.log('removeFromCart', productId)
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
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        resetCart,
        checkIfAlreadyInCart,
        totalCartQty,
        totalCartItemsPrice,
        currentStep,
        setCurrentStep,
        deliveryPrice,
        setDeliveryPrice,
        totalWeight,
        totalHeight,
        totalWidth,
        totalLength,
        totalPurchaseAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
