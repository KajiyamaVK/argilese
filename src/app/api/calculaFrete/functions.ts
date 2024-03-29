import { IShippingOption } from '@/models/IShippingOption'

export async function getDeliveryPrice(cep: string, height: number, width: number, length: number, weight: number) {
  interface IResponse {
    pacPrice: number
    sedexPrice: number
  }
  let response: IResponse = {} as IResponse

  await fetch(`https://www.melhorenvio.com.br/api/v2/me/shipment/calculate`, {
    cache: 'no-cache',
    method: 'POST',
    body: JSON.stringify({
      from: {
        postal_code: '03366070',
      },
      to: {
        postal_code: cep.replace('-', ''),
      },
      package: {
        height,
        width,
        length,
        weight,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      'user-agent': 'Argile-se',
      authorization: `Bearer ${process.env.TOKEN_FRETES}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //
      const pac = data.filter((item: IShippingOption) => item.name === 'PAC')

      const pacPrice = pac[0].error ? 0 : pac[0].price + pac[0].discount

      const sedex = data.filter((item: IShippingOption) => item.name === 'SEDEX')

      const sedexPrice: number = Number(sedex[0].price) + Number(sedex[0].discount)

      response = {
        pacPrice,
        sedexPrice,
      }
    })
    .catch(() => {
      console.error('Error fetching delivery price')
      return new Response(JSON.stringify({ message: 'Error fetching delivery price' }), { status: 500 })
    })

  return new Response(JSON.stringify(response), { status: 200 })
}
