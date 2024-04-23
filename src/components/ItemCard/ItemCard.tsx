'use client'
import Image from 'next/image'
import { baloo } from '@/utils/maskFunctions'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/models/products'
import { useContext } from 'react'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'

interface IItemCard {
  product: IProduct
}

export function ItemCard({ product }: IItemCard) {
  const { addToCart, checkIfAlreadyInCart } = useContext(PurchaseContext)
  const { sendAlert } = useContext(AlertDialogContext)
  const router = useRouter()
  function goToProductPage(id: number) {
    router.push(`/${id}`)
  }

  const productImages = product.productImages.split(';')
  return (
    <div className=" relative flex w-[300px]  flex-col flex-wrap rounded-lg bg-white p-5 pt-20 text-foreground shadow shadow-gray-500">
      <Image
        src={productImages[0]}
        width={150}
        height={150}
        alt=""
        className="absolute inset-x-0 -top-20 mx-auto rounded-full border-4 border-white object-cover shadow-lg shadow-gray-500"
      />
      <h3 className={`${baloo.className} mx-auto mb-4 font-extrabold`}>{product.productName}</h3>
      <p>{product.productDescription}</p>
      <div className=" flex  flex-1 flex-col justify-end">
        <div className="mt-3 flex items-end ">
          <p className="font-bold">R$ </p>
          <p className="-mb-1 ml-3 text-3xl">{product.price.toFixed(2)}</p>
        </div>
        <div className="mt-5 flex  flex-col justify-end gap-2">
          <button
            className="mx-auto w-full cursor-pointer rounded-lg  bg-yellow-700 p-2 text-white hover:opacity-50"
            onClick={() => {
              if (checkIfAlreadyInCart(product.id))
                return sendAlert({
                  message: `Ué... mas você já adicionou esse produto ao carrinho! `,
                  type: 'error',
                })
              sendAlert({ message: `Produto adicionado ao carrinho. A Argile-se agradece! ^^`, type: 'OK' })
              addToCart(product)
            }}
          >
            Adicionar ao carrinho
          </button>
          <button
            className="mx-auto w-full cursor-pointer rounded-lg  bg-yellow-700 p-2 text-white hover:opacity-50"
            onClick={() => goToProductPage(product.id)}
          >
            Ver mais
          </button>
        </div>
      </div>
    </div>
  )
}
