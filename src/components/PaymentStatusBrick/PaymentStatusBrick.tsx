'use client'

import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { StatusScreen } from '@mercadopago/sdk-react'
import { useContext, useEffect } from 'react'

interface IPaymentStatusBrick {
  paymentId: string
  paymentStatus: string
  //setPaymentId: Dispatch<SetStateAction<string>>
}

export function PaymentStatusBrick({ paymentId, paymentStatus }: IPaymentStatusBrick) {
  const { sendAlert } = useContext(AlertDialogContext)
  const { resetCart } = useContext(PurchaseContext)

  useEffect(() => {
    if (paymentStatus === 'approved') {
      sendAlert({
        message: 'Seu pagamento foi aprovado com sucesso. Muito obrigado! ^^',
        type: 'OK',
      })

      console.info('successful payment')
      resetCart()
    }
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
