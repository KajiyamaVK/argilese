import { MercadoPagoConfig, Payment } from 'mercadopago'

export async function POST(req) {
  const body = await req.json()
  console.log('body', body)

  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_TOKEN, options: { timeout: 5000 } })

  const payment = new Payment(client)

  return payment
    .create({
      body,
    })
    .then((response) => {
      return new Response(JSON.stringify(response), { status: 200 })
    })
    .catch((error) => {
      console.error(error)
      return new Response(JSON.stringify(error), { status: 400 })
    })
}
