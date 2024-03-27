import { getProductById } from './functions/getProductById'
import { getProductsAvailable } from './functions/getProductsAvailable'

export async function POST(req: Request) {
  const body = await req.json()

  const { action, id } = body
  switch (action) {
    case 'getProductsAvailable':
      try {
        const productsAvailable = await getProductsAvailable()
        return new Response(JSON.stringify(productsAvailable), {
          status: 200, // OK
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to get products available.' }), {
          status: 500, // Internal Server Error
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    case 'getProductById':
      try {
        const product = await getProductById(id)
        if (!product) {
          return new Response(JSON.stringify({ message: 'Product not found.' }), {
            status: 404, // Not Found
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
        return new Response(JSON.stringify(product), {
          status: 200, // OK
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to get product by id.' }), {
          status: 500, // Internal Server Error
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    default:
      return new Response(JSON.stringify({ message: 'Invalid action.' }), {
        status: 400, // Bad Request
        headers: {
          'Content-Type': 'application/json',
        },
      })
  }
}
