'use client'

import { AlertDialogContext } from '@/contexts/AlertDialogContext'

import { StatusScreen } from '@mercadopago/sdk-react'
import { useContext, useEffect } from 'react'

interface IPaymentStatusBrick {
  paymentId: string
  paymentStatus: string
  paymentMethod: string
}

export function PaymentStatusBrick({ paymentId, paymentStatus, paymentMethod }: IPaymentStatusBrick) {
  const { sendAlert } = useContext(AlertDialogContext)

  useEffect(() => {
    if (paymentStatus === 'approved' && paymentMethod === 'pix') {
      sendAlert({
        message: 'Seu pagamento foi aprovado com sucesso. Muito obrigado! ^^',
        type: 'OK',
      })

      console.info('successful payment')
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
