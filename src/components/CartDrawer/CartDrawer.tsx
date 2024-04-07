'use client'

//import { CartContext } from '@/contexts/CartContext'
import { Drawer } from '../Drawer/Drawer'
import { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { RxCaretRight } from 'react-icons/rx'
import { initMercadoPago } from '@mercadopago/sdk-react'
import { PaymentBrick } from '@/components/PaymentBrick/PaymentBrick'
import { ProductsList } from './ProductsList'
import { CartContext } from '@/contexts/CartContext'
import { DeliveryForm } from './DeliveryForm'

interface ICartDrawer {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function CartDrawer({ isOpen, setIsOpen }: ICartDrawer) {
  const { currentStep, totalCartQty, setCurrentStep, totalPurchaseAmount } = useContext(CartContext)

  const mercadoPagoPublicToken = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY
  if (mercadoPagoPublicToken) {
    initMercadoPago(mercadoPagoPublicToken)
  } else console.error('ML public key not found')

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('cart')
    }
    // eslint-disable-next-line
  }, [isOpen])

  useEffect(() => {
    if (totalCartQty === 0) {
      setIsOpen(false)
    }
    // eslint-disable-next-line
  }, [totalCartQty])

  //const [isPaymentBrickOpen, setIsPaymentBrickOpen] = useState<boolean>(false)

  // useEffect(() => {

  //   if (cep.length === 9) {
  //     setShowSkeleton(true)
  //     getDeliveryPrice()
  //   } else {
  //     setDeliveriesData(null)
  //     setChosenDelivery('')
  //   }

  //   // eslint-disable-next-line
  // }, [cep])

  // function handleRemoveFromCart(productId: number) {
  //   sendAlert({
  //     message: 'Deseja realmente remover este item do carrinho?',
  //     type: 'YN',
  //     onConfirm: () => {
  //       removeFromCart(productId)
  //       setIsAlertOpen(false)
  //     },
  //     onCancel: () => {
  //       setIsAlertOpen(false)
  //     },
  //   })
  // }

  // function handleChangeCep(value: string) {
  //   const formattedCep = formatCEP(value)
  //   setCep(formattedCep)
  // }
  return (
    <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-0 right-0 mt-24 flex h-full max-h-screen w-[400px] flex-col overflow-y-auto overflow-x-hidden rounded-l-[10px] bg-white ">
        <button className="ml-5 mt-5 flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <RxCaretRight /> Fechar
        </button>
        {currentStep === 'cart' && <ProductsList />}
        {currentStep === 'delivery' && <DeliveryForm />}
        {currentStep === 'payment' && <PaymentBrick amount={totalPurchaseAmount} preferenceId={'teste1'} />}
        {/* {isPaymentBrickOpen ? (
          <>
            <button className="ml-5 mt-5 flex items-center gap-2" onClick={() => setIsPaymentBrickOpen(false)}>
              <RxCaretLeft /> Voltar ao carrinho
            </button>
            <PaymentBrick amount={totalPurchaseAmount} preferenceId={'teste1'} />
          </>
        ) : (
          <> */}
        {/* <div className="flex-1 bg-white p-4 ">
          <div className="mx-auto max-w-md">
            <button className="mb-10 ml-5 mt-5 flex items-center gap-2" onClick={() => setIsOpen(false)}>
              Fechar <RxCaretRight />
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

              {/* <div className="mr-2 flex items-center justify-end gap-5">
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
                  </div> */}

        {/* </div> */}
        {/* </> */}
        {/* } */}
      </div>
    </Drawer.Root>
  )
}
