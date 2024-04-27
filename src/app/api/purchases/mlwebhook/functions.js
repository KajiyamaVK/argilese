import { Payment } from '@mercadopago/sdk-react'
import MercadoPagoConfig from 'mercadopago'

// paymentId is a string. PLEASE DO NOT HAVE A GREAT IDEA TO CHANGE IT TO NUMBER
export async function getPaymentData(paymentId) {
  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_TOKEN })
  const payment = new Payment(client)

  await payment
    .get({
      id: paymentId,
    })
    .then(console.log)
    .catch(console.log)
}
