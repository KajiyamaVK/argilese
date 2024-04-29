// paymentId is a string. PLEASE DO NOT HAVE A GREAT IDEA TO CHANGE IT TO NUMBER
export async function getPaymentData(paymentId) {
  const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
    },
  }).then((response) => {
    if (response.status === 200) {
      console.log('123123', response)
      return response.json()
      //return response
    }
    throw new Error('Failed to fetch payment data')
  })

  return payment
}
