import { sendEmail } from '@/utils/emailFunctions/sendEmail'
import { getCustomerData, getPaymentData, updatePaymentStatus } from './functions'
import { AfterPurchaseEmailHTML } from '@/utils/emailFunctions/AfterPurchaseEmail'
import { NextResponse } from 'next/server'

interface PaymentUpdate {
  action?: string
  api_version?: string
  data: {
    id: string
  }
  date_created?: string
  id?: string
  live_mode?: boolean
  type?: string
  user_id?: number
}

export async function POST(req: Request) {
  console.log('Entrou na api')
  let body: PaymentUpdate = {} as PaymentUpdate
  try {
    body = await req.json()
  } catch (e) {
    console.log('erroooou', e)
  }
  console.log('begin getPaymentData')
  const returnValue = await getPaymentData(body.data.id)
  console.log('end getPaymentData')
  console.log('returnValue', returnValue)
  console.log('begin updatePaymentStatus')
  console.log('returnValueStatus', returnValue.status)
  updatePaymentStatus({ paymentId: body.data.id, status: returnValue.status })
  console.log('end updatePaymentStatus')

  console.log('begin getCustomerData')
  const customerData = await getCustomerData(returnValue.id)
  console.log('end getCustomerData')

  if (returnValue.status === 'approved') {
    console.log('begin sendEmail')
    console.log('customerData', customerData)
    try {
      sendEmail({
        to: customerData[0].customerEmail,
        subject: 'Compra realizada com sucesso!',
        html: AfterPurchaseEmailHTML({
          name: customerData[0].customerName.split(' ')[0],
          order: customerData[0].purchaseIdFK.toString(),
        }),
      })
    } catch (e) {
      console.log('erroooou', e)
      return new Response('erro')
    }
    console.log('end sendEmail')
  }

  console.log('Saindo da API')
  const response = NextResponse.json({ message: 'OK' }, { status: 200 })

  return response
}

export async function GET() {
  return new Response('ok')
}
