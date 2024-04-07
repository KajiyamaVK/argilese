import { Conn } from '@/utils/database'
import { IOpenPurchase } from './models'
import { NextResponse } from 'next/server'
import { ResultSetHeader } from 'mysql2'
import { formatToNumber } from '@/utils/maskFunctions'

export async function POST(req: Request) {
  const body: IOpenPurchase = await req.json()
  const { action, data } = body

  if (action === 'openPurchase') {
    const { deliveryInfo, productsId } = data
    const {
      cep,
      deliveryPrice,
      deliveryType,
      deliveryTime,
      customerName,
      customerWhatsapp = null,
      customerEmail,
      address,
      addressNumber,
      complement = null,
      neighborhood,
      city,
      state,
    } = deliveryInfo

    const insertHeaderQuery = `
      INSERT INTO purchaseHeaders(
        customerName, 
        customerCpf, 
        customerEmail, 
        customerWhatsapp
      )
      VALUES(?,'0',?,?);
    `

    const insertPurchaseProductsQuery = `
      INSERT INTO purchaseProducts(
        purchaseIdFK, productIdFK)
      VALUES(?, ?);`

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
        state)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const insertedHeader: ResultSetHeader | any = await Conn.execute(insertHeaderQuery, [
        customerName,
        customerEmail,
        customerWhatsapp,
      ])
        .then((result) => {
          console.log('result', result)
          return result[0]
        })
        .catch((error) => {
          console.error(`Error inserting purchase header: ${error}`)
          throw new Error('Error inserting purchase header: ' + error)
        })

      productsId.forEach(async (productId) => {
        await Conn.execute(insertPurchaseProductsQuery, [insertedHeader.insertId, productId]).catch((error) => {
          console.error(`Error inserting purchase products: ${error}`)
          throw new Error('Error inserting purchase products: ' + error)
        })
      })

      await Conn.execute(insertDeliveryDataQuery, [
        insertedHeader.insertId,
        deliveryType,
        deliveryPrice,
        deliveryTime,
        customerName,
        customerWhatsapp,
        customerEmail,
        formatToNumber(cep),
        address,
        complement,
        addressNumber,
        neighborhood,
        city,
        state,
      ]).catch((error) => {
        console.error(`Error inserting purchase delivery data: ${error}`)
        throw new Error('Error inserting purchase delivery data: ' + error)
      })

      return new Response(JSON.stringify({ id: insertedHeader.insertId }), { status: 201 })
    } catch (error) {
      console.error(`Error fetching product by id: ${error}`)
      return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
    }
  }
}
