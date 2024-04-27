'use client'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { Payment } from '@mercadopago/sdk-react'
import { IPaymentBrickCustomization } from '@mercadopago/sdk-react/bricks/payment/type'
import { Dispatch, SetStateAction, useContext } from 'react'
import { savePayment } from './functions'
import { GeneralContext } from '@/contexts/GeneralContext'
import { sendEmail } from '@/utils/emailFunctions/sendEmail'
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
        zip_code: deliveryData.cep,
        state_name: deliveryData.state,
        city_name: deliveryData.city,
        street_name: deliveryData.address,
        street_number: isNaN(Number(deliveryData.addressNumber)) ? 0 : parseInt(deliveryData.addressNumber),
      },
    }

    const payer: Payer = {
      first_name: deliveryData.customerName.split(' ')[0],
      last_name: deliveryData.customerName.split(' ')[deliveryData.customerName.length - 1],
      phone: {
        area_code: deliveryData.customerWhatsapp.slice(0, 2),
        number: deliveryData.customerWhatsapp.slice(2, deliveryData.customerWhatsapp.length),
      },
      address: {
        street_number: isNaN(Number(deliveryData.addressNumber)) ? 0 : parseInt(deliveryData.addressNumber),
      },
    }

    const additional_info: AdditionalInfo = {
      items,
      payer,
      shipments,
    }

    const body = {
      ...formData,
      additional_info,
    }

    return new Promise<void>(async (resolve, reject) => {
      await fetch('api/purchases/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        // eslint-disable-next-line
        .then(async (response) => {
          // receber o resultado do pagamento
          console.log('response', response)
          resolve()
          if (!response.id) {
            sendAlert({ message: 'Erro ao realizar a compra!', type: 'error' })
            return
          } else {
            await savePayment({
              purchaseId: purchaseId,
              paymentId: response.id,
              paymentMethdod: response.payment_method.id,
              paymentType: response.payment_method.type,
              isApproved: response.status === 'approved',
              isRefunded: false,
              productsPaidAmount: response.transaction_amount,
              // eslint-disable-next-line
              financeFee: response.fee_details.filter((fee: any) => fee.type === 'financing_fee')[0].amount,
              // eslint-disable-next-line
              MLFee: response.fee_details.filter((fee: any) => fee.type === 'mercadopago_fee')[0].amount,
              paidAmount: response.transaction_details.total_paid_amount,
              netAmount: response.transaction_details.net_received_amount,
              installments: response.installments,
            })
            setPaymentId(response.id)
            sendEmail({
              to: deliveryData.customerEmail,
              subject: 'Argile-se - Confirmação de compra',
              html: AfterPurchaseEmailHTML({
                name: deliveryData.customerName,
                order: purchaseId.toString(),
              }),
            })
            setCurrentStep('paymentStatus')
          }
        })
        // eslint-disable-next-line
        .catch((error) => {
          reject()
        })
    })
  }
  // eslint-disable-next-line
  const onError = async (error: any) => {
    // callback chamado para todos os casos de erro do Brick
    alert('Erro não esperado. ')
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
        customization={customization as IPaymentBrickCustomization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </div>
  )
}
