'use client'
import { IProduct } from '@/models/products'
import { IPurchaseDelivery } from '@/models/deliveries'
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useMemo, useState } from 'react'

interface IPurchaseContext {
  cart: IProduct[]
  addToCart: (product: IProduct) => void
  removeFromCart: (productId: number) => void

  deliveryData: IPurchaseDelivery
  setDeliveryData: Dispatch<SetStateAction<IPurchaseDelivery>>
  resetCart: () => void
  checkIfAlreadyInCart: (productId: number) => boolean
  totalCartQty: number
  totalCartItemsPrice: number
  currentStep: TStep
  setCurrentStep: Dispatch<SetStateAction<TStep>>
  totalPurchaseAmount: number
}
export type TStep = 'cart' | 'delivery' | 'payment' | 'paymentStatus'

export const PurchaseContext = createContext({} as IPurchaseContext)

export function PurchaseContextProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<IProduct[]>([])
  const [currentStep, setCurrentStep] = useState<TStep>('cart')
  const [deliveryData, setDeliveryData] = useState<IPurchaseDelivery>({
    id: 0,
    customerName: '',
    price: null,
    type: '',
    customerWhatsapp: '',
    customerEmail: '',
    cep: '',
    address: '',
    complement: '',
    addressNumber: '',
    neighborhood: '',
    city: '',
    state: '',
    customPrice: '',
    totalWeight: 0,
    totalHeight: 0,
    totalWidth: 0,
    totalLength: 0,
    discount: '',
    currency: '',
    deliveryDays: 0,
    deliveryRange: { min: 0, max: 0 },
    customDeliveryDays: 0,
    customDeliveryRange: { min: 0, max: 0 },
    packages: [],
    additionalServices: { receipt: false, own_hand: false, collect: false },
    company: { id: 0, name: '', picture: '' },
  } as IPurchaseDelivery)

  useEffect(() => {
    let totalWeight = 0
    let totalHeight = 0
    let totalWidth = 0
    let totalLength = 0

    cart.forEach((product) => {
      totalWeight += product.weight
      totalHeight += product.height
      totalWidth += product.width
      totalLength += product.length
    })

    setDeliveryData({
      ...deliveryData,
      totalWeight,
      totalHeight,
      totalWidth,
      totalLength,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart])

  const totalCartQty = useMemo(() => cart.length, [cart])
  const totalCartItemsPrice = useMemo(() => cart.reduce((acc, product) => acc + product.price, 0), [cart])
  const totalPurchaseAmount: number | undefined = useMemo(() => {
    if (!deliveryData.price) return totalCartItemsPrice || 0
    return totalCartItemsPrice + deliveryData.price
  }, [totalCartItemsPrice, deliveryData.price])

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
    setCurrentStep('cart')
    setCart([])
  }

  return (
    <PurchaseContext.Provider
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
        totalPurchaseAmount,
        deliveryData,
        setDeliveryData,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  )
}
