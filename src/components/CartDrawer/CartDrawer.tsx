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
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const mercadoPagoPublicToken = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('cart')
      console.log('pending')
      setPaymentStatus('pending')
    }

    // To clear the cart when the payment is done and the user doesn't use the OK button.
    if (!isOpen && currentStep === 'paymentStatus') {
      resetCart()
    }
    // eslint-disable-next-line
  }, [isOpen])

  useEffect(() => {
    if (currentStep === 'payment') {
      initMercadoPago(mercadoPagoPublicToken!)
    } else if (currentStep === 'paymentStatus') {
      console.log('Opening Status')

      // The setInterval function will execute the async function getPurchasePaymentStatus
      // every 5 seconds until the payment status is 'approved'. The payment status is
      // updated in the component's state to reflect the new status.
      const interval = setInterval(async () => {
        const response = await getPurchasePaymentStatus(paymentId)
        console.log('response', response)
        if (response.status === 'approved') {
          // If the payment status is 'approved', the interval is cleared and the payment status is
          // updated in the component's state.
          clearInterval(interval)
        }
        setPaymentStatus(response.status) // Atualiza o estado para refletir o status aprovado
      }, 5000)

      console.log('Status Opened')
      return () => clearInterval(interval) // Limpeza do intervalo
    }
    // eslint-disable-next-line
  }, [currentStep, paymentId])

  useEffect(() => {
    if (totalCartQty === 0) {
      setIsOpen(false)
    }
    // eslint-disable-next-line
  }, [totalCartQty])

  return (
    <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-0 right-0 mt-24 flex h-full max-h-screen w-[400px] flex-col overflow-y-auto overflow-x-hidden rounded-l-[10px] bg-white ">
        <button className="ml-5 mt-5 flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <RxCaretRight /> Fechar
        </button>
        <ProductsList setPurchaseId={setPurchaseId} purchaseId={purchaseId} />
        <DeliveryForm purchaseId={purchaseId} />
        {currentStep === 'payment' && (
          <PaymentBrick
            amount={totalPurchaseAmount}
            setPaymentId={setPaymentId}
            purchaseId={purchaseId}
            setPaymentMethod={setPaymentMethod}
          />
        )}
        {currentStep === 'paymentStatus' && (
          <div className="flex flex-col justify-center">
            <PaymentStatusBrick
              paymentId={paymentId}
              paymentStatus={paymentStatus}
              paymentMethod={paymentMethod}
              setPaymentId={setPaymentId}
            />
            <Button className="border border-black bg-white text-black" onClick={resetCart}>
              Ok
            </Button>
          </div>
        )}
      </div>
    </Drawer.Root>
  )
}
