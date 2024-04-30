'use server'
import { IDBResponse } from '@/models/database'
import { IPurchaseDelivery } from '@/models/deliveries'

interface ISuperFreteOption {
  id: number
  name: string
  price: number
  discount: string
  currency: string
  delivery_time: number
  delivery_range: {
    min: number
    max: number
  }
  packages: [
    {
      price: number
      discount: string
      format: string
      dimensions: {
        height: string
        width: string
        length: string
      }
      weight: string
      insurance_value: number
    },
  ]
  additional_services: {
    receipt: boolean
    own_hand: boolean
  }
  company: {
    id: number
    name: string
    picture: string
  }
  has_error: boolean
}

interface ISuperFreteError {
  errors: any // eslint-disable-line
  message: string
}

export async function getDeliveryPrices(
  cep: string,
  height: number,
  width: number,
  length: number,
  weight: number,
): Promise<IDBResponse> {
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
        const pac = data.filter((item: IPurchaseDelivery) => item.type === 'PAC')

        const pacPrice = pac[0].error ? 0 : pac[0].price + pac[0].discount
        const pacDeliveryTime = pac[0].error ? 0 : pac[0].delivery_time

        const sedex = data.filter((item: IPurchaseDelivery) => item.type === 'SEDEX')
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
        return { message: 'Error fetching delivery price', isError: true, affectedRows: 0, insertId: 0 }
      })
  } else if (process.env.FRETE_SERVICE === 'cepcerto') {
    const urlString = `https://www.cepcerto.com/ws/json-frete/03366070/${cep.replace('-', '')}/${weight}/${height}/${width}/${length}/${process.env.TOKEN_CEPCERTO}`

    await fetch(urlString, {
      cache: 'no-cache',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        response = {
          pacPrice: data.valorpac,
          pacDeliveryTime: data.prazopac,
          sedexPrice: data.valorsedex,
          sedexDeliveryTime: data.prazosedex,
        }
      })
      .catch(() => {
        console.error('Error fetching delivery price')
        return { message: 'Error fetching delivery price', isError: true, affectedRows: 0, insertId: 0 }
      })
  } else if (process.env.FRETE_SERVICE === 'superfrete') {
    const url = 'https://sandbox.superfrete.com/api/v0/calculator'
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'User-Agent': 'Argile-se v.1.0.0',
        'content-type': 'application/json',
        Authorization: 'Bearer ' + process.env.TOKEN_SUPERFRETE,
      },
      body: JSON.stringify({
        from: { postal_code: '03366070' },
        to: { postal_code: cep.replace('-', '') },
        services: '1,2',
        options: {
          own_hand: false,
          receipt: false,
          insurance_value: 0,
          use_insurance_value: false,
        },
        package: { height, width, length, weight },
      }),
    }

    await fetch(url, options)
      .then((res) => res.json())
      .then((data: ISuperFreteOption[] | ISuperFreteError) => {
        console.log('package', { height, width, length, weight })
        console.log('data', data)

        if ((data as ISuperFreteError).errors) {
          console.error('Error fetching delivery price')
          return {
            message: 'Error fetching delivery price: ' + (data as ISuperFreteError).message,
            isError: true,
            affectedRows: 0,
            insertId: 0,
          }
        }

        if (Array.isArray(data)) {
          const pacData = data.filter((item: ISuperFreteOption) => item.name === 'PAC')
          const sedexData = data.filter((item: ISuperFreteOption) => item.name === 'SEDEX')

          response = {
            pacPrice: pacData[0].price,
            pacDeliveryTime: pacData[0].delivery_time,
            sedexPrice: sedexData[0].price + Number(sedexData[0].discount),
            sedexDeliveryTime: sedexData[0].delivery_time,
          }
        }
      })
      .then((json) => console.log(json))
      .catch((err) => console.error('error:' + err))
  }

  return { data: response, message: 'Delivery price fetched', isError: false, affectedRows: 0, insertId: 0 }
}
