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
//teste
export async function POST(req: Request) {
  const body: PaymentUpdate = await req.json()

  const returnValue = await getPaymentData(body.data.id)

  updatePaymentStatus({ paymentId: body.data.id, status: returnValue.status })

  const customerData = await getCustomerData(returnValue.id)

  if (returnValue.status === 'approved') {
    sendEmail({
      to: customerData[0].customerEmail,
      subject: 'Pagamento registrado! Muito obrigado! ^^ ',
      html: AfterPurchaseEmailHTML({
        name: customerData[0].customerName.split(' ')[0],
        order: customerData[0].purchaseIdFK.toString(),
      }),
    })
  }
  return new Response('ok')
}

export async function GET() {
  return new Response('ok')
}
