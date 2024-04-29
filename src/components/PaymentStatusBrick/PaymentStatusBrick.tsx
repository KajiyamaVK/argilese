'use client'

import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { PurchaseContext } from '@/contexts/PurchaseContext'

import { StatusScreen } from '@mercadopago/sdk-react'
import { useContext, useEffect } from 'react'
import { removeProductFromShelf } from '../PaymentBrick/functions'

interface IPaymentStatusBrick {
  paymentId: string
  paymentStatus: string
  paymentMethod: string
  setPaymentId: (paymentId: string) => void
}

export function PaymentStatusBrick({ paymentId, paymentStatus, paymentMethod, setPaymentId }: IPaymentStatusBrick) {
  const { sendAlert } = useContext(AlertDialogContext)
  const { resetCart, cart } = useContext(PurchaseContext)

  useEffect(() => {
    if (paymentStatus === 'approved' && paymentMethod === 'pix' && paymentId) {
      sendAlert({
        message: 'Seu pagamento foi aprovado com sucesso. Muito obrigado! ^^',
        type: 'OK',
      })
      cart.map((product) => {
        removeProductFromShelf(product.id)
      })

      console.info('successful payment')

      setPaymentId('')
      resetCart()
    }
    // eslint-disable-next-line
  }, [paymentStatus])

  const initialization = {
    paymentId, // id do pagamento a ser mostrado
  }
  // eslint-disable-next-line
  const onError = async (error:any) => {
    // callback chamado para todos os casos de erro do Brick
  }
  const onReady = async () => {}
  return <StatusScreen initialization={initialization} onReady={onReady} onError={onError} />
}
