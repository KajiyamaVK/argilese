import { Conn } from '@/utils/database'

export async function getProductsAvailable() {
  let result
  try {
    const [results] = await Conn.query(`
      SELECT
        id, 
        productName, 
        productDescription, 
        price, 
        productImages
      FROM products
      WHERE isActive = true`)
    result = results
  } catch (error) {
    console.error(`Error fetching products: ${error}`)
    return { message: 'Error fetching products' }
  }

  if (!result) {
    return new Response('No products available', { status: 404 })
  }
  return new Response(JSON.stringify(result), { status: 200 })
}
