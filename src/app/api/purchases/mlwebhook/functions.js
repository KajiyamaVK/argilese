// paymentId is a string. PLEASE DO NOT HAVE A GREAT IDEA TO CHANGE IT TO NUMBER
export async function getPaymentData(paymentId) {
  console.log('1')
  const data = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
    },
  }).then((response) => {
    console.log('response.status', response.status)
    if (response.status === 200) {
      return response.json()
    }
    throw new Error('Failed to fetch payment data')
  })

  console.log('data', data)
}
