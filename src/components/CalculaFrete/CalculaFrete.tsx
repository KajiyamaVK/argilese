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
  const [pacPrice, setPacPrice] = useState<number>(0)
  const [pacDeliveryTime, setPacDeliveryTime] = useState<number>(0)
  const [sedexPrice, setSedexPrice] = useState<number>(0)
  const [sedexDeliveryTime, setSedexDeliveryTime] = useState<number>(0)
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false)

  function handleChangeCep(value: string) {
    console.log('shazam!!!!!!!!')
    const formattedCep = formatCEP(value)
    setCep(formattedCep)
  }

  async function getDeliveryPrice() {
    setPacPrice(0)
    setSedexPrice(0)
    setPacDeliveryTime(0)
    setSedexDeliveryTime(0)
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
    console.log('111111111')
    if ((pacPrice !== 0 || sedexPrice !== 0) && showSkeleton) {
      setShowSkeleton(false)
    }
  }, [pacPrice, sedexPrice, showSkeleton])

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
      {pacPrice !== 0 && (
        <div className="mt-5 flex flex-col gap-5">
          <table>
            <tbody>
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
                  {showSkeleton ? (
                    <Skeleton className="ml-2 h-[20px] w-[50px] bg-gray-300" />
                  ) : (
                    `${pacDeliveryTime} dias`
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
