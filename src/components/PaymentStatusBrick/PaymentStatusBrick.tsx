'use client'

import { StatusScreen } from '@mercadopago/sdk-react'
import { useEffect, useRef } from 'react'

interface IPaymentStatusBrick {
  paymentId: string
  paymentStatus: string
  //setPaymentId: Dispatch<SetStateAction<string>>
}

export function PaymentStatusBrick({ paymentId, paymentStatus }: IPaymentStatusBrick) {
  //const { sendAlert, setIsAlertOpen } = useContext(AlertDialogContext)
  const alertSentRef = useRef(false)
  useEffect(() => {
    if (paymentStatus === 'approved' && !alertSentRef.current) {
      // sendAlert({
      //   message: 'Seu pagamento foi aprovado com sucesso. Muito obrigado! ^^',
      //   type: 'OK',
      //   onConfirm: () => {
      //     setIsAlertOpen(false)
      //   },
      // })

      console.info('successful payment')
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
