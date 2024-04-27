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

  const data = await getPaymentData(body.id)

  console.log('data', data)
}

export async function GET() {
  console.log('saves')

  return new Response('ok')
}
