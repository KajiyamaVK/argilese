import { Payment } from '@mercadopago/sdk-react'
import mercadopago from 'mercadopago'

// paymentId is a string. PLEASE DO NOT HAVE A GREAT IDEA TO CHANGE IT TO NUMBER
export async function getPaymentData(paymentId) {
  console.log('1')
  const client = new mercadopago({ accessToken: process.env.MERCADO_PAGO_TOKEN })
  console.log('2')
  const payment = new Payment(client)
  console.log('3')
  await payment
    .get({
      id: paymentId,
    })
    .then(console.log)
    .catch(console.log)
}
