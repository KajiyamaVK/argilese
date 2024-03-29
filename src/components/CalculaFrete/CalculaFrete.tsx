'use client'

import { useState } from 'react'
import { Button } from '../Button/Button'
import { formatCEP } from '@/utils/functions'

interface ICalculaFrete {
  height: number
  width: number
  length: number
  weight: number
}

export function CalculaFrete({ height, width, length, weight }: ICalculaFrete) {
  const [cep, setCep] = useState('')
  const [pacPrice, setPacPrice] = useState(0)
  const [sedexPrice, setSedexPrice] = useState(0)

  function handleChangeCep(value: string) {
    const formattedCep = formatCEP(value)
    setCep(formattedCep)
  }

  async function getDeliveryPrice() {
    //await fetch(`${process.env.API_URL}//api/calculaFrete`, {
    await fetch(`/api/calculaFrete`, {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify({ width, height, length, weight, cep }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPacPrice(data.pacPrice)
        setSedexPrice(data.sedexPrice)
      })
  }

  return (
    <div className="flex flex-col mx-auto md:mx-0">
      <label htmlFor="cepInput" className="mt-10">
        Quer calcular o frete? Digite seu CEP.
      </label>

      <div>
        <input
          type="text"
          id="cepInput"
          className="border border-gray-300 rounded-md p-2 w-[200px] max-w-[150px]"
          value={cep}
          onChange={(e) => handleChangeCep(e.target.value)}
        />
        <Button className="ml-5" disabled={cep.length < 9} onClick={getDeliveryPrice}>
          Calcular
        </Button>
      </div>
      {pacPrice > 0 ||
        (sedexPrice > 0 && (
          <div className="mt-2">
            <p>
              <b>Preço do PAC:</b> R$ {pacPrice.toFixed(2).replace('.', ',')}
            </p>
            <p>
              <b>Preço do Sedex:</b> R$ {sedexPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>
        ))}
    </div>
  )
}
