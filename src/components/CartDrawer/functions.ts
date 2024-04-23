'use server'
import { RowDataPacket } from 'mysql2'
import { getDatabaseConnection } from '@/utils/database'
import { ResultSetHeader } from 'mysql2'
import mysql from 'mysql2/promise'
import { IPurchaseDelivery } from '@/models/deliveries'
import { IPurchase } from '@/models/purchase'
import { IDBResponse } from '@/models/database'

interface IInsertPurchaseHeader {
  customerName: string
  customerEmail: string
  customerWhatsapp: string | null
  Conn: mysql.Pool
}

export async function insertPurchase({ deliveryData, cartData }: IPurchase): Promise<IDBResponse> {
  const Conn = await getDatabaseConnection()
  try {
    await Conn.query('START TRANSACTION;')
    const purchaseId = await insertPurchaseHeader({
      customerName: deliveryData.customerName,
      customerEmail: deliveryData.customerEmail,
      customerWhatsapp: deliveryData.customerWhatsapp,
      Conn,
    })

    await Promise.all([
      insertPurchaseProducts({
        purchaseId,
        productsId: cartData.map((product) => product.id),
        Conn,
      }),
      insertPurchaseDelivery({
        purchaseId,
        data: deliveryData,
        Conn,
      }),
    ])

    await Conn.query('COMMIT;')
    return {
      message: 'Purchase inserted successfully',
      isError: false,
      affectedRows: 1,
      insertId: purchaseId,
    }
  } catch (error) {
    console.error('Transaction error:', error)
    await Conn.query('ROLLBACK;')
    return {
      message: `Database error: ${error}`,
      isError: true,
      affectedRows: 0,
      insertId: 0,
    }
  } finally {
    Conn.end()
  }
}

export async function insertPurchaseHeader({
  customerName,
  customerEmail,
  customerWhatsapp,
  Conn,
}: IInsertPurchaseHeader): Promise<number> {
  const insertHeaderQuery = `
    INSERT INTO purchaseHeaders(
      customerName, 
      customerCpf, 
      customerEmail, 
      customerWhatsapp
    )
    VALUES(?,'0',?,?);
  `

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inserted] = await Conn.query<ResultSetHeader>(insertHeaderQuery, [
    customerName,
    customerEmail,
    customerWhatsapp,
  ]).catch((error) => {
    console.error(`Error inserting purchase header: ${error}`)
    throw new Error('Database error inserting purchase header: ' + error)
  })

  return inserted.insertId
}

interface IInsertPurchaseProducts {
  purchaseId: number
  productsId: number[]
  Conn: mysql.Pool
}

export async function insertPurchaseProducts({ purchaseId, productsId, Conn }: IInsertPurchaseProducts): Promise<void> {
  const insertPurchaseProductsQuery = `
    INSERT INTO purchaseProducts(purchaseIdFK, productIdFK) VALUES(?, ?);
  `

  try {
    await Promise.all(
      productsId.map((productId) => {
        return Conn.execute(insertPurchaseProductsQuery, [purchaseId, productId])
      }),
    )
  } catch (error) {
    console.error(`Error inserting purchase products: ${error}`)
    throw new Error('Database error inserting purchase products: ' + error)
  }
}

interface IInsertPurchaseDelivery {
  purchaseId: number
  data: IPurchaseDelivery
  Conn: mysql.Pool
}

export async function insertPurchaseDelivery({ purchaseId, data, Conn }: IInsertPurchaseDelivery): Promise<void> {
  const insertDeliveryDataQuery = `
    INSERT INTO purchaseDeliveries(
      purchaseIdFK, 
      deliveryType, 
      deliveryPrice, 
      deliveryTime, 
      customerName, 
      customerWhatsapp, 
      customerEmail, 
      cep, 
      address, 
      complement, 
      addressNumber, 
      neighborhood, 
      city, 
      state
    )
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);
  `

  Conn.execute(insertDeliveryDataQuery, [
    purchaseId,
    data.type,
    data.price,
    data.deliveryDays,
    data.customerName,
    data.customerWhatsapp,
    data.customerEmail,
    data.cep,
    data.address,
    data.complement,
    data.addressNumber,
    data.neighborhood,
    data.city,
    data.state,
  ]).catch((error) => {
    console.error(`Error inserting purchase delivery data: ${error}`)
    return new Error('Database error inserting purchase delivery data: ' + error)
  })
}

export async function getCitiesByUF(uf: string) {
  const connection = await getDatabaseConnection()
  const result: string[] = []

  try {
    const [rows] = await connection.query<RowDataPacket[]>(`SELECT name FROM stdCities WHERE state_id = ?`, [uf])
    rows.map((row) => result.push(row.name))
    const returnValue: IDBResponse = {
      isError: false,
      message: 'Cities fetched successfully',
      data: result,
      affectedRows: rows.length,
      insertId: 0,
    }

    return returnValue
  } catch (error) {
    console.error('Failed to fetch cities from database:', error)
    return {
      isError: true,
      message: 'Failed to fetch cities from database: ' + error,
      affectedRows: 0,
      insertId: 0,
    }
  } finally {
    connection.end()
  }
}
