'use Client'

import { StatusScreen } from '@mercadopago/sdk-react'
import { Dispatch, SetStateAction } from 'react'

interface IPaymentStatusBrick {
  paymentId: string
  setPaymentId: Dispatch<SetStateAction<string>>
}

export function PaymentStatusBrick({ paymentId }: IPaymentStatusBrick) {
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
