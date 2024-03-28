import { getProductById } from './functions/getProductById'
import { getProductsAvailable } from './functions/getProductsAvailable'

export async function POST(req: Request) {
  const body = await req.json()

  const { action, id } = body
  switch (action) {
    case 'getProductsAvailable':
      return await getProductsAvailable()
    case 'getProductById':
      return await getProductById(id)
    default:
      return new Response(JSON.stringify({ message: 'Invalid action' }), { status: 400 })
  }
}

export async function GET() {
  return await getProductsAvailable()
}
