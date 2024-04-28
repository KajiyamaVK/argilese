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

  console.log('MLProcessBody', MLProcessBody)
  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_TOKEN, options: { timeout: 5000 } })
  const payment = new Payment(client)
  console.log('client', client)

  console.log('payment', payment)

  try {
    return payment
      .create({
        body: MLProcessBody,
        requestOptions: {
          idempotency: randomUUID(),
        },
      })
      .then((response) => {
        console.log('response', response)
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        })
      })
      .catch((error) => {
        console.error('Eita', error)
        return new Response(JSON.stringify(error), {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        })
      })
  } catch (error) {
    console.error('Eita', error)
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}
