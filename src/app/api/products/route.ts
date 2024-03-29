import { getProductById } from './functions/getProductById'
import { getProductsAvailable } from './functions/getProductsAvailable'
// eslint-disable-next-line
export async function POST(req: Request) {
  const body = await req.json()
  const { id } = body
  return await getProductById(id)
}

export async function GET() {
  return await getProductsAvailable()
}
