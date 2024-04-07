'use client'
import { CartContext } from '@/contexts/CartContext'
import { Payment } from '@mercadopago/sdk-react'
import { useContext } from 'react'

export function PaymentBrick({ amount, preferenceId }) {
  const { resetCart } = useContext(CartContext)

  const initialization = {
    amount,
    preferenceId,
  }
  const customization = {
    paymentMethods: {
      ticket: 'all',
      bankTransfer: 'all',
      creditCard: 'all',
    },
  }

  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    // callback chamado ao clicar no botão de submissão dos dados

    console.log('selectedPaymentMethod', selectedPaymentMethod)
    console.log('formData', JSON.stringify(formData))

    /*
  Current Body
  {
    "token": "995b40cc1a7f592c2a9abd898b997174",
    "issuer_id": "24",
    "payment_method_id": "master",
    "transaction_amount": 102,
    "installments": 1,
    "payer": {
        "email": "victor.kajiyama@gmail.com",
        "identification": {
            "type": "CPF",
            "number": "12345678909"
        }
    }
}
  */

    return new Promise((resolve, reject) => {
      fetch('api/purchases/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        // eslint-disable-next-line
        .then((response) => {
          // receber o resultado do pagamento

          resolve()
          alert('Pagamento realizado com sucesso!')
          resetCart()
        })
        // eslint-disable-next-line
        .catch((error) => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject()
        })
    })
  }
  // eslint-disable-next-line
  const onError = async (error) => {
    // callback chamado para todos os casos de erro do Brick
  }
  const onReady = async () => {
    /*
    Callback chamado quando o Brick estiver pronto.
    Aqui você pode ocultar loadings do seu site, por exemplo.
  */
  }

  return (
    <div>
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </div>
  )
}
