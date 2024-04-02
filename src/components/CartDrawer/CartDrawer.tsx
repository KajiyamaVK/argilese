'use client'

import { GeneralContext } from '@/contexts/general'
import { Drawer } from 'vaul'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '../Button/Button'
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx'
import { initMercadoPago } from '@mercadopago/sdk-react'
import { formatCEP } from '@/utils/maskFunctions'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '../ui/skeleton'
import { PaymentBrick } from '@/components/PaymentBrick/PaymentBrick'

interface ICartDrawer {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

interface IGetFreteResponse {
  pacPrice: string
  pacDeliveryTime: string
  sedexPrice: string
  sedexDeliveryTime: string
}

type TDelivery = 'PAC' | 'SEDEX' | ''

export function CartDrawer({ isOpen, setIsOpen }: ICartDrawer) {
  const { cart, removeFromCart } = useContext(GeneralContext)
  const [totalItemsAmount, setTotalItemsAmount] = useState<string>('')
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState<number>(0)
  const [totalWeight, setTotalWeight] = useState<number>(0)
  const [totalHeight, setTotalHeight] = useState<number>(0)
  const [totalWidth, setTotalWidth] = useState<number>(0)
  const [totalLength, setTotalLength] = useState<number>(0)
  const [cep, setCep] = useState<string>('')
  const [chosenDelivery, setChosenDelivery] = useState<TDelivery>('')
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false)
  const [deliveriesData, setDeliveriesData] = useState<IGetFreteResponse | null>(null)
  const [isPaymentBrickOpen, setIsPaymentBrickOpen] = useState<boolean>(false)

  useEffect(() => {
    let deliveryPrice = 0

    if (chosenDelivery === 'PAC') {
      deliveryPrice = parseFloat(deliveriesData?.pacPrice || '0')
    } else if (chosenDelivery === 'SEDEX') {
      deliveryPrice = parseFloat(deliveriesData?.sedexPrice || '0')
    }

    const totalAmount = parseFloat(totalItemsAmount) + deliveryPrice

    setTotalPurchaseAmount(totalAmount)
  }, [chosenDelivery, deliveriesData, totalItemsAmount])

  useEffect(() => {
    if (cart.length === 0) {
      setIsOpen(false)
      return
    }
    let totalItemsAmount = 0
    let totalWeight = 0
    let totalHeight = 0
    let totalWidth = 0
    let totalLength = 0

    cart.forEach((product) => {
      totalItemsAmount += product.price
      totalWeight += product.weight
      totalHeight += product.height
      totalWidth += product.width
      totalLength += product.length
    })

    setTotalItemsAmount(totalItemsAmount.toFixed(2).replace('.', ','))
    setTotalWeight(totalWeight)
    setTotalHeight(totalHeight)
    setTotalWidth(totalWidth)
    setTotalLength(totalLength)
    // eslint-disable-next-line
  }, [cart])

  useEffect(() => {
    async function getDeliveryPrice() {
      setShowSkeleton(true)
      await fetch(`/api/calculaFrete`, {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify({
          width: totalWidth.toString(),
          height: totalHeight.toString(),
          length: totalLength.toString(),
          weight: totalWeight.toString(),
          cep,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.msg) throw new Error(data.msg)
          setDeliveriesData(data)
        })
        .then(() => setShowSkeleton(false))
        .catch((error) => {
          console.error(error)
          alert('Erro ao calcular frete: ' + error)
        })
    }

    if (cep.length === 9) {
      getDeliveryPrice()
    } else {
      setDeliveriesData(null)
      setChosenDelivery('')
    }

    // eslint-disable-next-line
  }, [cep])

  async function goToPayment() {
    if (process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY === undefined)
      return console.error('Mercado Pago public key is not defined')

    if (!cep) return alert('Digite um CEP válido')
    if (!chosenDelivery) return alert('Escolha um tipo de entrega')

    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY)

    // callback chamado ao clicar no botão de submissão dos dados
    setIsPaymentBrickOpen(true)
  }

  function handleChangeCep(value: string) {
    const formattedCep = formatCEP(value)
    setCep(formattedCep)
  }
  return (
    <Drawer.Root direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0 overflow-y-scroll overflow-x-hidden">
          {isPaymentBrickOpen ? (
            <>
              <button className="flex gap-2 items-center mt-5 ml-5" onClick={() => setIsPaymentBrickOpen(false)}>
                <RxCaretLeft /> Voltar ao carrinho
              </button>
              <PaymentBrick amount={totalPurchaseAmount} preferenceId={'teste1'} />
            </>
          ) : (
            <>
              <Drawer.Close>
                <button className="flex gap-2 items-center mt-5 ml-5">
                  Fechar <RxCaretRight />
                </button>
              </Drawer.Close>
              <div className="p-4 bg-white flex-1 h-full">
                <div className="max-w-md mx-auto">
                  <Drawer.Title className="font-medium mb-4">Carrinho</Drawer.Title>
                  <div className="flex flex-col gap-4">
                    {cart.map((product) => (
                      <div key={product.id} className="flex border-b-2 border-gray-100 py-10">
                        <Image
                          src={product.productImages.split(';')[0]}
                          alt={product.productName}
                          width={70}
                          height={70}
                          className="rounded-full border-2 border-gray-200 shadow-lg shadow-gray-500"
                        />
                        <div className=" ml-10 flex flex-col justify-between">
                          <p>{product.productName}</p>
                          <div className="flex gap-2 items-end justify-end">
                            <p className="font-bold">R$ </p>
                            <p className="font-bold ">{product.price.toFixed(2).replace('.', ',')}</p>
                          </div>
                          <button
                            className="text-destructive self-end"
                            onClick={() => {
                              removeFromCart(product.id)
                            }}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-5 items-center justify-end mr-2">
                      <label htmlFor="cep">
                        <b>Digite seu CEP:</b>
                      </label>
                      <input
                        type="text"
                        id="cepInput"
                        className="border border-gray-300 rounded-md p-2 w-[200px] max-w-[150px]"
                        value={cep}
                        onChange={(e) => handleChangeCep(e.target.value)}
                      />
                    </div>
                    {showSkeleton || (deliveriesData && deliveriesData.pacPrice !== undefined) ? (
                      <div className="flex ml-14">
                        <div>
                          <RadioGroup
                            className="ml-10"
                            value={chosenDelivery}
                            onValueChange={(e) => {
                              setChosenDelivery(e as TDelivery)
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="SEDEX" id="sedexChk" />
                              <Label htmlFor="sedexChk">
                                <table>
                                  <tr>
                                    <td className="w-20">SEDEX</td>
                                    <td>
                                      {showSkeleton ? (
                                        <Skeleton className="w-40 h-4 bg-gray-300" />
                                      ) : (
                                        <span>
                                          R$ {deliveriesData!.sedexPrice.replace('.', ',')} -{' '}
                                          {deliveriesData!.sedexDeliveryTime} dias úteis
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                </table>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="PAC" id="pacChk" />
                              <Label htmlFor="pacChk">
                                <table>
                                  <tr>
                                    <td className="w-20">PAC</td>
                                    <td>
                                      {showSkeleton ? (
                                        <Skeleton className="w-40 h-4 bg-gray-300" />
                                      ) : (
                                        <span>
                                          R$ {deliveriesData!.pacPrice.replace('.', ',')} -{' '}
                                          {deliveriesData!.pacDeliveryTime} dias úteis
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                </table>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    <table className="ml-20">
                      <tr>
                        <td className="font-bold w-fit">Quantidade de itens: </td>
                        <td className="flex-1">{cart.length}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Total dos itens: </td>
                        <td>R$ {totalItemsAmount}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Frete: </td>
                        <td>R$ {chosenDelivery === 'PAC' ? deliveriesData?.pacPrice : deliveriesData?.sedexPrice}</td>
                      </tr>
                    </table>
                  </div>
                  <Button className="mt-10 bg-yellow-700 float-right" onClick={goToPayment}>
                    Finalizar compra
                  </Button>
                </div>
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
