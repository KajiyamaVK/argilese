'use client'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { Payment } from '@mercadopago/sdk-react'
import { IPaymentBrickCustomization } from '@mercadopago/sdk-react/bricks/payment/type'
import { useContext } from 'react'

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
  preferenceId: string
}

export function PaymentBrick({ amount, preferenceId }: IPaymentBrick) {
  const { resetCart, cart, deliveryData } = useContext(PurchaseContext)

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

  // eslint-disable-next-line
  const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
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
    // callback chamado ao clicar no botão de submissão dos dados

    const body = {
      ...formData,
      additional_info,
    }

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

Full Body


  body: {
    additional_info: {
      items: [
        {
          id: 'MLB2907679857',
          title: 'Point Mini',
          description: 'Point product for card payments via Bluetooth.',
          picture_url: 'https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium2x.png',
          category_id: 'electronics',
          quantity: 1,
          unit_price: 58.8,
        }
      ],
      payer: {
        first_name: 'Test',
        last_name: 'Test',
        phone: {
          area_code: '11',
          number: '987654321'
        },
        address: {
          street_number: null
        }
      },
      shipments: {
        receiver_address: {
          zip_code: '12312-123',
          state_name: 'Rio de Janeiro',
          city_name: 'Buzios',
          street_name: 'Av das Nacoes Unidas',
          street_number: 3003
        }
      }
    },
    application_fee: null,
    binary_mode: false,
    campaign_id: null,
    capture: false,
    coupon_amount: null,
    description: 'Payment for product',
    differential_pricing_id: null,
    external_reference: 'MP0001',
    installments: 1,
    metadata: null,
    payer: {
      entity_type: 'individual',
      type: 'customer',
      email: 'test_user_123@testuser.com',
      identification: {
        type: 'CPF',
        number: '95749019047'
      }
    },
    payment_method_id: 'master',
    token: 'ff8080814c11e237014c1ff593b57b4d',
    transaction_amount: 58.8
  },
  */

    return new Promise<void>((resolve, reject) => {
      fetch('api/purchases/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
  const onError = async (error: any) => {
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
        customization={customization as IPaymentBrickCustomization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </div>
  )
}
