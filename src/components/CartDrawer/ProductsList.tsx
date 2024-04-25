import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import Image from 'next/image'
import { Dispatch, SetStateAction, useContext } from 'react'
import { Button } from '../Button/Button'
import { TotalsContainer } from './TotalsContainer'
import { openPurchase } from './functions'

interface IProductList {
  setPurchaseId: Dispatch<SetStateAction<number>>
}

export function ProductsList({ setPurchaseId }: IProductList) {
  const { cart, removeFromCart, setCurrentStep, currentStep } = useContext(PurchaseContext)
  const { sendAlert, setIsAlertOpen } = useContext(AlertDialogContext)

  function handleRemoveFromCart(productId: number) {
    sendAlert({
      message: 'Deseja realmente remover este lindo, fofo e exclusivo item do seu carrinho?',
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

  async function goToDeliveryForm() {
    const result = await openPurchase(cart)
    setPurchaseId(result.insertId)
    setCurrentStep('delivery')
  }

  return (
    <div className={`flex-1 bg-white p-4 ${currentStep !== 'cart' && 'hidden'}`}>
      <div className="mx-auto max-w-md">
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
        </div>
        <TotalsContainer />
        <Button className="float-right mt-10 w-full bg-yellow-700" onClick={goToDeliveryForm}>
          Ir para os dados de entrega
        </Button>
      </div>
    </div>
  )
}
