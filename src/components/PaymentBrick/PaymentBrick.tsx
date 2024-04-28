'use client'
import { sendEmail } from '@/utils/emailFunctions/sendEmail'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { Payment as PaymentComponent } from '@mercadopago/sdk-react'
import { IPaymentBrickCustomization } from '@mercadopago/sdk-react/bricks/payment/type'
import { Dispatch, SetStateAction, useContext } from 'react'

import { GeneralContext } from '@/contexts/GeneralContext'
import { formatCEP } from '@/utils/maskFunctions'
import { ufs } from '@/data/UFs'
import { savePayment } from './functions'
import { AfterPurchaseEmailHTML } from '@/utils/emailFunctions/AfterPurchaseEmail'

export interface AdditionalInfo {
  items: Item[]
  payer: Payer
  shipments: Shipment
}

interface Item {
  id: string
  title: string
  description: string
  picture_url: string
  category_id: string
  quantity: number
  unit_price: number
}

interface Payer {
  first_name: string
  last_name: string
  phone?: Phone
  address: Address
}

interface Phone {
  area_code: string
  number: string
}

interface Address {
  street_number: null | number
}

interface Shipment {
  receiver_address: ReceiverAddress
}

interface ReceiverAddress {
  zip_code: string
  state_name: string
  city_name: string
  street_name: string
  street_number?: number
}

interface IPaymentBrick {
  amount: number
  setPaymentId: Dispatch<SetStateAction<string>>
  purchaseId: number
}

export function PaymentBrick({ amount, setPaymentId, purchaseId }: IPaymentBrick) {
  const { cart, deliveryData, setCurrentStep } = useContext(PurchaseContext)
  const { isAdmin } = useContext(GeneralContext)
  const { sendAlert } = useContext(AlertDialogContext)

  const initialization = {
    amount: isAdmin ? 1 : amount,
  }
  const customization = {
    paymentMethods: {
      ticket: 'all',
      bankTransfer: 'all',
      creditCard: 'all',
    },
  }

  // eslint-disable-next-line
  const onSubmit = async ({  formData }: any) => {
    const items: Item[] = cart.map((product) => {
      const item: Item = {
        id: product.id.toString(),
        title: product.productName,
        description: product.productDescription,
        picture_url: product.productImages.split(';')[0],
        category_id: 'Ceramics',
        quantity: 1,
        unit_price: product.price,
      }
      return item
    })

    const shipments: Shipment = {
      receiver_address: {
        zip_code: formatCEP(deliveryData.cep),
        state_name: ufs.find((uf) => uf.value === deliveryData.state)?.label!, //eslint-disable-line
        city_name: deliveryData.city,
        street_name: deliveryData.address,
        street_number: isNaN(Number(deliveryData.addressNumber)) ? 0 : parseInt(deliveryData.addressNumber),
      },
    }
    const payer: Payer = {
      first_name: deliveryData.customerName.split(' ')[0],
      last_name: deliveryData.customerName.split(' ')[deliveryData.customerName.length - 1] ?? '',
      phone: {
        area_code: deliveryData.customerWhatsapp.slice(0, 2),
        number: deliveryData.customerWhatsapp.slice(2, deliveryData.customerWhatsapp.length),
      },
      address: {
        street_number: isNaN(Number(deliveryData.addressNumber)) ? 0 : parseInt(deliveryData.addressNumber),
      },
    }

    // eslint-disable-next-line
    const additional_info: AdditionalInfo = {
      items,
      payer,
      shipments,
    }

    const body = {
      ...formData,
      additional_info,
    }
    console.log('formData', formData)
    console.log('body', body)

    return new Promise<void>(async (resolve, reject) => {
      await fetch('/api/purchases/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('response.id', response.id)
          console.log('response2', response)
          setPaymentId(response.id)
          if (response.status === 500) {
            sendAlert({ type: 'error', message: response.message })
            reject()
            return
          }

          resolve()

          sendAlert({ type: 'OK', message: 'Pagamento efetuado com sucesso!' })
          savePayment({
            purchaseId,
            paymentId: response.id,
            paymentMethdod: response.payment_method_id,
            paymentType: response.payment_type_id,
            status: response.status,
            productsPaidAmount: response.transaction_amount,
            financeFee: response.fee_details.find((fee: any) => fee.type === 'financing_fee')?.amount ?? 0, //eslint-disable-line
            MLFee: response.fee_details.find((fee: any) => fee.type === 'mercadopago_fee')?.amount ?? 0, //eslint-disable-line
            paidAmount: response.transaction_details.total_paid_amount ?? 0,
            netAmount: response.transaction_details.net_received_amount ?? 0,
            installments: response.installments,
          })

          sendEmail({
            to: response.payer.email,
            subject: 'Compra realizada com sucesso!',
            html: AfterPurchaseEmailHTML({
              name: deliveryData.customerName.split(' ')[0],
              order: purchaseId.toString(),
            }),
          })

          setCurrentStep('paymentStatus')
          // receber o resultado do pagamento
        })
        .catch(() => {
          // lidar com a resposta de erro ao tentar criar o pagamento
          reject()
        })
    })
  }

  // eslint-disable-next-line
  const onError = async (error: any) => {
    // callback chamado para todos os casos de erro do Brick
    alert('Erro não esperado. ' + error.message)
  }

  const onReady = async () => {
    /*
    Callback chamado quando o Brick estiver pronto.
    Aqui você pode ocultar loadings do seu site, por exemplo.
  */
  }

  return (
    <div>
      <PaymentComponent
        initialization={initialization}
        customization={customization as IPaymentBrickCustomization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </div>
  )
}
