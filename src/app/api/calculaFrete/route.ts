import { getDeliveryPrice } from './functions'

// eslint-disable-next-line

interface IPostBody {
  width: number
  height: number
  length: number
  weight: number
  cep: string
}
export async function POST(req: Request) {
  const body: IPostBody = await req.json()
  const { width, height, length, weight, cep } = body

  return await getDeliveryPrice(cep, width, height, length, weight)
}
