import { getPaymentData } from './functions'

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

export async function POST(req: Request): Promise<void> {
  const body: PaymentUpdate = await req.json()
  console.log('body', body)

  const returnValue = await getPaymentData(body.id)
  console.log('returnValue', returnValue)
}

export async function GET() {
  return new Response('ok')
}
