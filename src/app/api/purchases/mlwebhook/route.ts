import { sendEmail } from '@/utils/emailFunctions/sendEmail'
import { getCustomerData, getPaymentData, updatePaymentStatus } from './functions'
import { AfterPurchaseEmailHTML } from '@/utils/emailFunctions/AfterPurchaseEmail'

interface PaymentUpdate {
  action: string
  api_version: string
  data: {
    id: string
  }
  date_created: string
  id: string
  live_mode: boolean
  type: string
  user_id: number
}

export async function POST(req: Request) {
  const body: PaymentUpdate = await req.json()
  console.log('body', body)

  const returnValue = await getPaymentData(body.id)
  console.log('returnValue', returnValue)

  updatePaymentStatus({ paymentId: body.id, status: returnValue.status })

  const customerData = await getCustomerData(returnValue.payer.id)
  console.log('customerData', customerData)

  sendEmail({
    to: customerData[0].customerEmail,
    subject: 'Pagamento registrado! Muito obrigado! ^^ ',
    html: AfterPurchaseEmailHTML({
      name: customerData[0].customerName.split(' ')[0],
      order: customerData[0].purchaseIdFK.toString(),
    }),
  })
  return new Response('ok')
}

export async function GET() {
  return new Response('ok')
}
