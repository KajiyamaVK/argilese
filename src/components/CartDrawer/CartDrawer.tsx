'use client'

//import { PurchaseContext } from '@/contexts/PurchaseContext'
import { Drawer } from '../Drawer/Drawer'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { RxCaretRight } from 'react-icons/rx'
import { initMercadoPago } from '@mercadopago/sdk-react'
import { PaymentBrick } from '@/components/PaymentBrick/PaymentBrick'
import { ProductsList } from './ProductsList'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { DeliveryForm } from './DeliveryForm'
import { PaymentStatusBrick } from '../PaymentStatusBrick/PaymentStatusBrick'
import { Button } from '../Button/Button'
import { getPurchasePaymentStatus } from './functions'

interface ICartDrawer {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function CartDrawer({ isOpen, setIsOpen }: ICartDrawer) {
  const { currentStep, totalCartQty, setCurrentStep, totalPurchaseAmount, resetCart } = useContext(PurchaseContext)
  const [paymentId, setPaymentId] = useState<string>('')
  const [purchaseId, setPurchaseId] = useState<number>(0)
  const [paymentStatus, setPaymentStatus] = useState<string>('pending')
  const mercadoPagoPublicToken = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('cart')
    }

    // To clear the cart when the payment is done and the user doesn't use the OK button.
    if (!isOpen && currentStep === 'paymentStatus') {
      resetCart()
    }
    // eslint-disable-next-line
  }, [isOpen])

  useEffect(() => {
    switch (currentStep) {
      case 'payment':
        if (mercadoPagoPublicToken) {
          initMercadoPago(mercadoPagoPublicToken)
        }
        break

      case 'paymentStatus':
        setInterval(async () => {
          await getPurchasePaymentStatus(paymentId).then((response) => {
            setPaymentStatus(response.status)
          })
        }, 5000)
        break
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
        <ProductsList setPurchaseId={setPurchaseId} purchaseId={purchaseId} />
        <DeliveryForm purchaseId={purchaseId} />
        {currentStep === 'payment' && (
          <PaymentBrick amount={totalPurchaseAmount} setPaymentId={setPaymentId} purchaseId={purchaseId} />
        )}
        {currentStep === 'paymentStatus' && (
          <div className="flex flex-col justify-center">
            <PaymentStatusBrick paymentId={paymentId} paymentStatus={paymentStatus} />
            <Button className="border border-black bg-white text-black" onClick={resetCart}>
              Ok
            </Button>
          </div>
        )}
      </div>
    </Drawer.Root>
  )
}
