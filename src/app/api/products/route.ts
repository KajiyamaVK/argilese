//import { getProductById } from './functions/getProductById'
// import { getProductsAvailable } from './functions/getProductsAvailable'
// eslint-disable-next-line
export async function POST(req: Request) {
  console.log('POST')
  //const body = await req.json()
  //const { id } = body
  //return await getProductById(id)
  return new Response('POST')
}

export async function GET() {
  //return await getProductsAvailable()
  return new Response('GET')
}
