import { randomUUID } from 'crypto'
import { MercadoPagoConfig, Payment } from 'mercadopago'

export async function POST(req) {
  const body = await req.json()
  // const body = {
  //   transaction_amount: 12.34,
  //   description: '<DESCRIPTION>',
  //   payment_method_id: 'master',
  //   payer: {
  //     email: 'victor.kajiyama@gmail.com',
  //   },
  // }

  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_TOKEN,
    options: { timeout: 20000, idempotencyKey: randomUUID() },
  })
  

  const payment = new Payment(client)
  

  return await payment
    .create({
      body,
    })
    .then((response) => {
      

      return new Response(JSON.stringify(response))
    })
    .catch((error) => {
      return new Response(JSON.stringify(error))
    })
}
