'use server'
import { RowDataPacket } from 'mysql2'
import { getDatabaseConnection } from '@/utils/databaseFunctions/createConnection'
import { ResultSetHeader } from 'mysql2'
import mysql from 'mysql2/promise'
import { IPurchaseDelivery } from '@/models/deliveries'
import { IDBResponse } from '@/models/database'
import { IProduct } from '@/models/products'

export async function openPurchase(cartData: IProduct[]): Promise<IDBResponse> {
  const Conn = await getDatabaseConnection()
  let purchaseId = 0

  try {
    await Conn.query('START TRANSACTION;')
    purchaseId = await savePurchaseHeader(Conn)

    await savePurchaseProducts({
      purchaseId,
      productsId: cartData.map((product) => product.id),
      Conn,
    }).then(async () => {
      await Conn.query('COMMIT;')
    })
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

  return {
    message: 'Purchase opened successfully',
    isError: false,
    affectedRows: 1,
    insertId: purchaseId,
  }
}

export async function savePurchaseHeader(Conn: mysql.Pool): Promise<number> {
  const insertHeaderQuery = `
    INSERT INTO purchaseHeaders()
    VALUES();
  `

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inserted] = await Conn.query<ResultSetHeader>(insertHeaderQuery).catch((error) => {
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

export async function savePurchaseProducts({ purchaseId, productsId, Conn }: IInsertPurchaseProducts): Promise<void> {
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

interface ISavePurchaseDelivery {
  purchaseId: number
  data: IPurchaseDelivery
}

export async function savePurchaseDelivery({ purchaseId, data }: ISavePurchaseDelivery): Promise<void> {
  const Conn = await getDatabaseConnection()
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
