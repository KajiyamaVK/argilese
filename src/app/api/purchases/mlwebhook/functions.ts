import { getDatabaseConnection } from '@/utils/databaseFunctions/createConnection'
import { FieldPacket, QueryResult } from 'mysql2'

// paymentId is a string. PLEASE DO NOT HAVE A GREAT IDEA TO CHANGE IT TO NUMBER
/**
 * The function `getPaymentData` fetches payment data from the Mercado Pago API using the provided
 * payment ID and returns the data.
 * @param {string} paymentId - The `paymentId` parameter in the `getPaymentData` function is a string
 * that represents the unique identifier of a payment transaction. This function is designed to fetch
 * payment data from the Mercado Pago API using the provided `paymentId`.
 * @returns The `getPaymentData` function is returning the payment data fetched from the Mercado Pago
 * API for the specified `paymentId`. If the fetch operation is successful and the response status is
 * 200, it returns the JSON data of the payment. If there is an error during the fetch operation or the
 * response status is not 200, it throws an error message "Failed to fetch payment data"
 */
export async function getPaymentData(paymentId: string) {
  try {
    console.log('paymentId', paymentId)
    console.log('begin fetch')

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
      },
    })

    console.log('response', response)

    if (response.status !== 200) {
      throw new Error('Failed to fetch payment data')
    }

    const payment = await response.json()
    console.log('end fetch')

    return payment
  } catch (error) {
    console.error('Failed to fetch payment data', error)
    throw error // Lançar o erro para que ele possa ser tratado externamente
  }
}

export async function updatePaymentStatus({ paymentId, status }: { paymentId: string; status: string }) {
  const Conn = await getDatabaseConnection()

  const updateQuery = `
    UPDATE purchasePayments
    SET status = ?
    WHERE paymentId = ?
  `

  await Conn.query(updateQuery, [status, paymentId])
    .catch((err) => {
      console.error('Failed to update payment status', err.message)
    })
    .finally(() => {
      Conn.end()
    })
}

interface IGetCustomerDataResponse {
  customerEmail: string
  purchaseIdFK: number
  customerName: string
}
export async function getCustomerData(paymentId: number) {
  const Conn = await getDatabaseConnection()

  const query = `
    SELECT pd.customerEmail, pp.purchaseIdFK, pd.customerName
    FROM purchaseDeliveries pd 
    JOIN purchasePayments pp  
      ON pd.purchaseIdFK = pp.purchaseIdFK
    WHERE pp.paymentId = ?;
  `

  const customerData: IGetCustomerDataResponse[] = await Conn.query(query, [paymentId])
    .then(([results]: [QueryResult, FieldPacket[]]) => {
      return results as IGetCustomerDataResponse[]
    })
    .catch((err) => {
      console.error('Failed to fetch customer email', err)
      return []
    })
    .finally(() => {
      Conn.end()
    })

  return customerData
}
