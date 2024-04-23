'use server'

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

// This function fetches city names for a given UF code from the database

// eslint-disable-next-line

export interface ICity {
  nome: string
  id: number
}

// Fetch state names and cities from the IBGE API
export async function getStateAndCities(): Promise<{ uf: string; stateName: string; cities: ICity[] }[]> {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  const states = await response.json()
  return Promise.all(
    states.map(async (state: { sigla: string; nome: string }) => {
      const cityResponse = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.sigla}/municipios`,
      )
      const cities = await cityResponse.json()
      return {
        uf: state.sigla,
        stateName: state.nome,
        cities: cities.map((city: { nome: string; id: number }) => ({ name: city.nome, id: city.id })),
      }
    }),
  )
}
