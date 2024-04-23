import { IDBResponse } from '@/models/database'
import { IProduct } from '@/models/products'
import { getDatabaseConnection } from '@/utils/database'
import { FieldPacket, QueryResult } from 'mysql2'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export async function getProducts(id?: number) {
  noStore() // To not cache the page
  const Conn = await getDatabaseConnection()
  let returnValue: IDBResponse = {} as IDBResponse
  try {
    // Usando parâmetros na query para prevenir injeção de SQL.

    const getProductsQuery = `
      SELECT
        id,
        productName,
        productDescription,
        price,
        productImages,
        height,
        width,
        weight,
        length,
        diameter,
        hasHandle,
        milliliters
      FROM products
      ${id ? 'WHERE id = ?' : ''}
    `

    await Conn.query(
      getProductsQuery,
      [id],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )
      .then(([results]: [QueryResult, FieldPacket[]]) => {
        if (Array.isArray(results) && results.length === 0) {
          returnValue = { message: 'Product not found', isError: true, affectedRows: 0, insertId: 0 }
        } else {
          returnValue = {
            data: results as IProduct[],
            message: '',
            isError: false,
            affectedRows: 0,
            insertId: 0,
          }
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        console.error(`Error fetching products: ${error}`)
        returnValue = { message: `Error fetching products: ${error}`, isError: true } as IDBResponse
      })
  } catch (error) {
    console.error(`Error fetching product by id: ${error}`)
    //return new Response(JSON.stringify({ message: 'Error fetching product' }), { status: 500 })
    return { message: 'Error fetching products', isError: true } as IDBResponse
  } finally {
    Conn.end()
    return returnValue
  }
}
