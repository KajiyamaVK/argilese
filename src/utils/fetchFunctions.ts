import Error from 'next/error'

interface IGetDeliveryTimeAndValue {
  width: number
  height: number
  length: number
  weight: number
  cep: string
}

export async function getFrete({ width, height, length, weight, cep }: IGetDeliveryTimeAndValue) {
  await fetch(`/api/calculaFrete`, {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({ width, height, length, weight, cep }),
  })
    .then((res) => res.json())
    .then((data) => {
      return new Response(JSON.stringify(data), { status: 200 })
    })
    .catch((error: Error) => {
      console.error(error)
      return new Response(JSON.stringify({ error: 'Error fetching data: ' + error }), { status: 500 })
    })
}
