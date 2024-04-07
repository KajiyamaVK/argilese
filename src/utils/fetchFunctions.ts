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

interface IAddress {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}
// eslint-disable-next-line

interface IAddressError {
  error: string
}

// eslint-disable-next-line
export async function getAddressByCep(cep: string): Promise<IAddress | IAddressError | any> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error({ statusCode: response.status, message: 'Erro ao buscar o cep. Entre em contato com o suporte.' })
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Error fetching data: ' + error }
  }
}

// eslint-disable-next-line
export function getCityByUf(uf: string): Promise<string[] | any> {
  return fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const cities: string[] = data.map((city: { nome: string }) => city.nome)

      return cities
    })
    .catch((error) => {
      console.error(error)
      return { error: 'Error fetching data: ' + error }
    })
}
