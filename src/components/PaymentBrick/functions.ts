'use server'
import { IDBResponse } from '@/models/database'
import { getDatabaseConnection } from '@/utils/database'

type TPaymentMethod = 'master' | 'visa' | 'pix'
type TPaymentType = 'credit_card' | 'debit_card' | 'pix' | 'boleto'

interface ISavePayment {
  purchaseId: number
  paymentId: string | null
  paymentMethdod: TPaymentMethod | null
  paymentType: TPaymentType | null
  isApproved: boolean
  isRefunded: boolean
  productsPaidAmount: number | null
  financeFee: number | null
  MLFee: number | null
  paidAmount: number | null
  netAmount: number | null
  installments: number | null
}

export async function savePayment(data: ISavePayment): Promise<IDBResponse> {
  const Conn = await getDatabaseConnection()
  const savePaymentQuery = `
    INSERT INTO purchasePayments(
      purchaseIdFK,
      paymentId,
      paymentMethod,
      paymentType,
      isRefunded,
      isApproved,
      productsPaidAmount,
      financeFee,
      MLFee,
      paidAmount,
      netAmount)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`

  await Conn.query(savePaymentQuery, [
    data.purchaseId,
    data.paymentId,
    data.paymentMethdod,
    data.paymentType,
    data.isApproved,
    data.isRefunded,
    data.productsPaidAmount,
    data.financeFee,
    data.MLFee,
    data.paidAmount,
    data.netAmount,
  ])
    .catch((err) => {
      return { message: err.message, isError: true } as IDBResponse
    })
    .finally(() => {
      Conn.end()
    })
  return { message: 'Gravado com sucesso', isError: false } as IDBResponse
}

export async function updatePayment(data: ISavePayment): Promise<IDBResponse> {
  const Conn = await getDatabaseConnection()
  const updatePaymentQuery = `
    UPDATE purchasePayments
    SET
      paymentId = ?,
      paymentMethod = ?,
      paymentType = ?,
      isRefunded = ?,
      isApproved = ?,
      productsPaidAmount = ?,
      financeFee = ?,
      MLFee = ?,
      paidAmount = ?,
      netAmount = ?
    WHERE purchaseIdFK = ?`

  await Conn.query(updatePaymentQuery, [
    data.paymentId,
    data.paymentMethdod,
    data.paymentType,
    data.isApproved,
    data.isRefunded,
    data.productsPaidAmount,
    data.financeFee,
    data.MLFee,
    data.paidAmount,
    data.netAmount,
    data.purchaseId,
  ])
    .catch((err) => {
      return { message: err.message, isError: true } as IDBResponse
    })
    .finally(() => {
      Conn.end()
    })
  return { message: 'Atualizado com sucesso', isError: false } as IDBResponse
}
