'use client'

import { CartContext } from '@/contexts/CartContext'
import { Drawer } from '../Drawer/Drawer'
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '../Button/Button'
import { RxCaretLeft } from 'react-icons/rx'
import { initMercadoPago } from '@mercadopago/sdk-react'
import { formatCEP } from '@/utils/maskFunctions'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '../ui/skeleton'
import { PaymentBrick } from '@/components/PaymentBrick/PaymentBrick'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'

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
  const { cart, removeFromCart } = useContext(CartContext)
  const { sendAlert, setIsAlertOpen } = useContext(AlertDialogContext)
  const [totalItemsAmount, setTotalItemsAmount] = useState<string>('')
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState<number>(0)
  const [totalWeight, setTotalWeight] = useState<number>(0)
  const [totalHeight, setTotalHeight] = useState<number>(0)
  const [totalWidth, setTotalWidth] = useState<number>(0)
  const [totalLength, setTotalLength] = useState<number>(0)
  const [cep, setCep] = useState<string>('')
  const [chosenDelivery, setChosenDelivery] = useState<TDelivery>('')
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false)
  const [deliveriesData, setDeliveriesData] = useState<IGetFreteResponse | null>({
    pacPrice: '',
    pacDeliveryTime: '',
    sedexPrice: '',
    sedexDeliveryTime: '',
  })
  const [isPaymentBrickOpen, setIsPaymentBrickOpen] = useState<boolean>(false)

  const deliveryPrices = useMemo(
    () => ({
      PAC: deliveriesData?.pacPrice,
      SEDEX: deliveriesData?.sedexPrice,
    }),
    [deliveriesData],
  )

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
      setShowSkeleton(true)
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

  function handleRemoveFromCart(productId: number) {
    sendAlert({
      message: 'Deseja realmente remover este item do carrinho?',
      type: 'YN',
      onConfirm: () => {
        removeFromCart(productId)
        setIsAlertOpen(false)
      },
      onCancel: () => {
        setIsAlertOpen(false)
      },
    })
  }

  function handleChangeCep(value: string) {
    const formattedCep = formatCEP(value)
    setCep(formattedCep)
  }
  return (
    <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-0 right-0 mt-24 flex h-full max-h-screen w-[400px] flex-col overflow-y-auto overflow-x-hidden rounded-l-[10px] bg-white ">
        {isPaymentBrickOpen ? (
          <>
            <button className="ml-5 mt-5 flex items-center gap-2" onClick={() => setIsPaymentBrickOpen(false)}>
              <RxCaretLeft /> Voltar ao carrinho
            </button>
            <PaymentBrick amount={totalPurchaseAmount} preferenceId={'teste1'} />
          </>
        ) : (
          <>
            <div className="flex-1 bg-white p-4 ">
              <div className="mx-auto max-w-md">
                <button className="mb-10 ml-5 mt-5 flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <RxCaretLeft /> Voltar ao carrinho
                </button>
                <h1 className="mb-4 font-medium">Carrinho</h1>
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
                        <div className="flex items-end justify-end gap-2">
                          <p className="font-bold">R$ </p>
                          <p className="font-bold ">{product.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <button
                          className="self-end text-destructive"
                          onClick={() => {
                            handleRemoveFromCart(product.id)
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mr-2 flex items-center justify-end gap-5">
                    <label htmlFor="cep">
                      <b>Digite seu CEP:</b>
                    </label>
                    <input
                      type="text"
                      id="cepInput"
                      className="w-[200px] max-w-[150px] rounded-md border border-gray-300 p-2"
                      value={cep}
                      onChange={(e) => handleChangeCep(e.target.value)}
                    />
                  </div>
                  {cep.length === 9 ? (
                    <div className="ml-14 flex">
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
                                    {showSkeleton && (!deliveriesData || !deliveriesData.sedexPrice) ? (
                                      <Skeleton className="h-4 w-40 bg-gray-300" />
                                    ) : (
                                      <span>
                                        R$ {deliveriesData?.sedexPrice.replace('.', ',')} -{' '}
                                        {deliveriesData?.sedexDeliveryTime} dias úteis
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
                                      <Skeleton className="h-4 w-40 bg-gray-300" />
                                    ) : (
                                      <span>
                                        R$ {deliveriesData?.pacPrice.replace('.', ',')} -{' '}
                                        {deliveriesData?.pacDeliveryTime} dias úteis
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

                  {cart.length && (
                    <table className="ml-20">
                      <tr>
                        <td className="w-fit font-bold">Quantidade de itens: </td>
                        <td className="flex-1">{cart.length}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Total dos itens: </td>
                        <td>R$ {totalItemsAmount}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Frete: </td>
                        <td>R$ {chosenDelivery === '' ? '' : deliveryPrices[chosenDelivery]}</td>
                      </tr>
                    </table>
                  )}
                </div>
                <Button className="float-right mt-10 bg-yellow-700" onClick={goToPayment}>
                  Finalizar compra
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer.Root>
  )
}
