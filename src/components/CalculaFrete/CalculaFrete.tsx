'use client'

import { useEffect, useState } from 'react'
import { Button } from '../Button/Button'
import { formatCEP } from '@/utils/maskFunctions'
import pacLogo from '/public/logos/pacLogo.png'
import sedexLogo from '/public/logos/sedexLogo.png'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'
import { getDeliveryPrices } from '@/app/[itemId]/functions'

interface ICalculaFrete {
  height: string
  width: string
  length: string
  weight: string
}

export function CalculaFrete({ height, width, length, weight }: ICalculaFrete) {
  const [cep, setCep] = useState('')
  const [pacPrice, setPacPrice] = useState<number | null>(null)
  const [pacDeliveryTime, setPacDeliveryTime] = useState<number | null>(null)
  const [sedexPrice, setSedexPrice] = useState<number | null>(null)
  const [sedexDeliveryTime, setSedexDeliveryTime] = useState<number | null>(null)
  const [showSkeleton, setShowSkeleton] = useState<boolean | null>(null)

  function handleChangeCep(value: string) {
    const formattedCep = formatCEP(value)
    setCep(formattedCep)
  }

  async function getDeliveryPrice() {
    setPacPrice(null)
    setSedexPrice(null)
    setPacDeliveryTime(null)
    setSedexDeliveryTime(null)
    setShowSkeleton(true)

    await getDeliveryPrices(cep, Number(height), Number(width), Number(length), Number(weight)).then((data) => {
      const result = data.data
      setPacPrice(result.pacPrice)
      setSedexPrice(result.sedexPrice)
      setPacDeliveryTime(result.pacDeliveryTime)
      setSedexDeliveryTime(result.sedexDeliveryTime)
    })
  }

  useEffect(() => {
    if (pacPrice !== null || sedexPrice !== 0) {
      setShowSkeleton(false)
    }
  }, [pacPrice, sedexPrice])

  return (
    <div className="mx-auto flex flex-col md:mx-0">
      <label htmlFor="cepInput" className="mt-10">
        Quer calcular o frete? Digite seu CEP.
      </label>

      <div>
        <input
          type="text"
          id="cepInput"
          className="w-[200px] max-w-[150px] rounded-md border border-gray-300 p-2"
          value={cep}
          onChange={(e) => handleChangeCep(e.target.value)}
        />
        <Button className="ml-5 " disabled={cep.length < 9} onClick={getDeliveryPrice}>
          Calcular
        </Button>
      </div>
      {showSkeleton !== null ? (
        <div className="mt-5 flex flex-col gap-5">
          <table>
            <tr>
              <Image src={pacLogo} alt="Ícone de Pac dos Correios" width={125} height={38} />
            </tr>
            <tr>
              <td className="w-[100px]">
                <b>Preço:</b>
              </td>
              <td className="flex items-center">
                R${' '}
                {showSkeleton ? (
                  <Skeleton className="ml-2 h-[20px] w-[50px] bg-gray-300" />
                ) : (
                  pacPrice?.toString().replace('.', ',')
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>Prazo:</b>
              </td>
              <td>
                {showSkeleton ? <Skeleton className="ml-2 h-[20px] w-[50px] bg-gray-300" /> : `${pacDeliveryTime} dias`}
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <Image src={sedexLogo} alt="Ícone do Sedex dos Correios" width={125} height={38} />
            </tr>
            <tr>
              <td className="w-[100px]">
                <b>Preço:</b>
              </td>
              <td className="flex items-center">
                R${' '}
                {showSkeleton ? (
                  <Skeleton className="ml-2 h-[20px] w-[50px] bg-gray-300" />
                ) : (
                  sedexPrice?.toString().replace('.', ',')
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>Prazo:</b>
              </td>
              <td>
                {showSkeleton ? (
                  <Skeleton className="ml-2 h-[20px] w-[50px] bg-gray-300" />
                ) : (
                  `${sedexDeliveryTime} dias`
                )}
              </td>
            </tr>
          </table>
        </div>
      ) : null}
    </div>
  )
}
