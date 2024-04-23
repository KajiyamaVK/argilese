'use client'

//import { PurchaseContext } from '@/contexts/PurchaseContext'
import { Drawer } from '../Drawer/Drawer'
import { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { RxCaretRight } from 'react-icons/rx'
import { initMercadoPago } from '@mercadopago/sdk-react'
import { PaymentBrick } from '@/components/PaymentBrick/PaymentBrick'
import { ProductsList } from './ProductsList'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { DeliveryForm } from './DeliveryForm'

interface ICartDrawer {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function CartDrawer({ isOpen, setIsOpen }: ICartDrawer) {
  const { currentStep, totalCartQty, setCurrentStep, totalPurchaseAmount } = useContext(PurchaseContext)

  const mercadoPagoPublicToken = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('cart')
    }
    // eslint-disable-next-line
  }, [isOpen])

  useEffect(() => {
    if (mercadoPagoPublicToken && currentStep === 'payment') {
      initMercadoPago(mercadoPagoPublicToken)
    }
    // eslint-disable-next-line
  }, [currentStep])

  useEffect(() => {
    if (totalCartQty === 0) {
      setIsOpen(false)
    }
    // eslint-disable-next-line
  }, [totalCartQty])

  useEffect(() => {}, [totalPurchaseAmount])

  return (
    <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-0 right-0 mt-24 flex h-full max-h-screen w-[400px] flex-col overflow-y-auto overflow-x-hidden rounded-l-[10px] bg-white ">
        <button className="ml-5 mt-5 flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <RxCaretRight /> Fechar
        </button>
        <ProductsList />
        <DeliveryForm />
        {currentStep === 'payment' && <PaymentBrick amount={totalPurchaseAmount} preferenceId={'teste1'} />}
      </div>
    </Drawer.Root>
  )
}
