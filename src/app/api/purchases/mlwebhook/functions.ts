import { getDatabaseConnection } from '@/utils/databaseFunctions/createConnection'
import { FieldPacket, QueryResult } from 'mysql2'

// paymentId is a string. PLEASE DO NOT HAVE A GREAT IDEA TO CHANGE IT TO NUMBER
export async function getPaymentData(paymentId: string) {
  const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json()
    }
    throw new Error('Failed to fetch payment data')
  })

  return payment
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
      console.error('Failed to update payment status', err)
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
      ON pd.purchaseIdFK = pd.purchaseIdFK = pp.purchaseIdFK
    WHERE pp.id = ?;
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
