import { randomUUID } from 'crypto'
import { MercadoPagoConfig, Payment } from 'mercadopago'

export async function POST(req) {
  const body = await req.json()

  let MLProcessBody

  switch (body.payment_method_id) {
    case 'pix':
      MLProcessBody = {
        transaction_amount: body.transaction_amount,
        description: body.additional_info.items[0].title,
        payment_method_id: body.payment_method_id,
        payer: {
          email: body.payer.email,
        },
      }
      break
    default:
      MLProcessBody = body
      break
  }

  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_TOKEN, options: { timeout: 5000 } })

  const payment = new Payment(client)

  return payment
    .create({
      body: MLProcessBody,
      requestOptions: {
        idempotency: randomUUID(),
      },
    })
    .then((response) => {
      return new Response(JSON.stringify(response), { status: 200 })
    })
    .catch((error) => {
      console.error(error)
      return new Response(JSON.stringify(error), { status: 400 })
    })
}
