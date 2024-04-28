'use client'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { Payment } from '@mercadopago/sdk-react'
import { IPaymentBrickCustomization } from '@mercadopago/sdk-react/bricks/payment/type'
import { Dispatch, SetStateAction, useContext } from 'react'
import { savePayment } from './functions'
import { GeneralContext } from '@/contexts/GeneralContext'
import { formatCEP } from '@/utils/maskFunctions'
import { ufs } from '@/data/UFs'
import MercadoPagoConfig from 'mercadopago'
import { randomUUID } from 'crypto'

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
      // phone: {
      //   area_code: deliveryData.customerWhatsapp.slice(0, 2),
      //   number: deliveryData.customerWhatsapp.slice(2, deliveryData.customerWhatsapp.length),
      // },
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
      //additional_info,
    }
    console.log('body', body)
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_TOKEN!, options: { timeout: 5000 } })
    const payment:any = new (Payment as any)(client) //eslint-disable-line



    try {
      payment
        .create({
          body,
          requestOptions: {
            idempotency: randomUUID(),
          },
        })
        .then((response: any) => { //eslint-disable-line
          console.log('response', response)
          return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          })
          // eslint-disable-next-line
        }).then(async (response: any) => { 
          // eslint-disable-next-line
          const financeFeeResult = response.fee_details.find((fee: any) => fee.type === 'financing_fee')
          const financeFee = financeFeeResult ? financeFeeResult.amount : 0
          console.log('financeFee', financeFee)

          // eslint-disable-next-line
          const MLFeeResult = response.fee_details.find((fee: any) => fee.type === 'mercadopago_fee')
          const MLFee = MLFeeResult ? MLFeeResult.amount : 0

          console.log('MLFee', MLFee)
          try {
            await savePayment({
              purchaseId: purchaseId,
              paymentId: response.id,
              paymentMethdod: response.payment_method.id,
              paymentType: response.payment_method.type === 'bank_transfer' ? 'pix' : response.payment_method.type,
              status: response.status,
              productsPaidAmount: response.transaction_amount,
              // eslint-disable-next-line
            financeFee,
              // eslint-disable-next-line
            MLFee,
              paidAmount: response.transaction_details.total_paid_amount,
              netAmount: response.transaction_details.net_received_amount,
              installments: response.installments,
            })
            console.log('response.id', response.id)
            setPaymentId(response.id)
            console.log('2')

            setCurrentStep('paymentStatus')
          } catch (error) {
            console.log('error', error)
            sendAlert({ message: 'Erro ao salvar o pagamento!', type: 'error' })
          }
        })
        .catch((error: any) => {// eslint-disable-line
          console.error('Eita', error)
          return new Response(JSON.stringify(error), {
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          })
        })
    } catch (error) {
      console.error('Eita', error)
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }
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
