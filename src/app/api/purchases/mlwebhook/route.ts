import { sendEmail } from '@/utils/emailFunctions/sendEmail'
import { getCustomerData, getPaymentData, updatePaymentStatus } from './functions'
import { AfterPurchaseEmailHTML } from '@/utils/emailFunctions/AfterPurchaseEmail'

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
//teste
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
  updatePaymentStatus({ paymentId: body.data.id, status: returnValue.status })
  console.log('end updatePaymentStatus')

  console.log('begin getCustomerData')
  const customerData = await getCustomerData(returnValue.id)
  console.log('end getCustomerData')

  if (returnValue.status === 'approved') {
    console.log('begin sendEmail')
    sendEmail({
      to: customerData[0].customerEmail,
      subject: 'Pagamento registrado! Muito obrigado! ^^ ',
      html: AfterPurchaseEmailHTML({
        name: customerData[0].customerName.split(' ')[0],
        order: customerData[0].purchaseIdFK.toString(),
      }),
    })
    console.log('end sendEmail')
  }
  return new Response('ok')
}

export async function GET() {
  return new Response('ok')
}
