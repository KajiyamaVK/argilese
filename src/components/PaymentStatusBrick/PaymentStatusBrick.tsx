'use Client'

import { StatusScreen } from '@mercadopago/sdk-react'
import { useContext, useEffect, useRef } from 'react'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
interface IPaymentStatusBrick {
  paymentId: string
  paymentStatus: string
  //setPaymentId: Dispatch<SetStateAction<string>>
}

export function PaymentStatusBrick({ paymentId, paymentStatus }: IPaymentStatusBrick) {
  const { sendAlert } = useContext(AlertDialogContext)
  const alertSentRef = useRef(false)
  useEffect(() => {
    if (paymentStatus === 'approved' && !alertSentRef.current) {
      sendAlert({
        message: 'Seu pagamento foi aprovado com sucesso. Muito obrigado! ^^',
        type: 'OK',
      })
      alertSentRef.current = true
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
