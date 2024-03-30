import { IShippingOption } from '@/models/IShippingOption'

export async function getDeliveryPrice(cep: string, height: number, width: number, length: number, weight: number) {
  interface IResponse {
    pacPrice: number
    pacDeliveryTime: number
    sedexPrice: number
    sedexDeliveryTime: number
  }
  let response: IResponse = {} as IResponse
  if (process.env.FRETE_SERVICE === 'melhor envio') {
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
        const pacDeliveryTime = pac[0].error ? 0 : pac[0].delivery_time

        const sedex = data.filter((item: IShippingOption) => item.name === 'SEDEX')
        const sedexDeliveryTime = sedex[0].error ? 0 : sedex[0].delivery_time

        const sedexPrice: number = Number(sedex[0].price) + Number(sedex[0].discount)

        response = {
          pacPrice,
          pacDeliveryTime,
          sedexPrice,
          sedexDeliveryTime,
        }
      })
      .catch(() => {
        console.error('Error fetching delivery price')
        return new Response(JSON.stringify({ message: 'Error fetching delivery price' }), { status: 500 })
      })
  } else if (process.env.FRETE_SERVICE === 'cepcerto') {
    console.log('cep destino', cep)
    await fetch(
      `https://www.cepcerto.com/ws/json-frete/03366070/${cep.replace('-', '')}/${weight}/${height}/${width}/${length}/${process.env.TOKEN_CEPCERTO}`,
      {
        cache: 'no-cache',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data)
        response = {
          pacPrice: data.valorpac,
          pacDeliveryTime: data.prazopac,
          sedexPrice: data.valorsedex,
          sedexDeliveryTime: data.prazosedex,
        }
      })
      .catch(() => {
        console.error('Error fetching delivery price')
        return new Response(JSON.stringify({ message: 'Error fetching delivery price' }), { status: 500 })
      })
  }
  console.log('response', response)
  return new Response(JSON.stringify(response), { status: 200 })
}
