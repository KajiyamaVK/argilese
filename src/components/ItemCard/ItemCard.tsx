'use client'
import Image from 'next/image'
import { baloo } from '@/utils/maskFunctions'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/models/products'
import { useContext } from 'react'
import { GeneralContext } from '@/contexts/general'

interface IItemCard {
  product: IProduct
}

export function ItemCard({ product }: IItemCard) {
  const { addToCart, cart } = useContext(GeneralContext)
  const router = useRouter()
  function goToProductPage(id: number) {
    router.push(`/${id}`)
  }

  function checkIfAlreadyInCart(productId: number) {
    return cart.some((product) => product.id === productId)
  }
  const productImages = product.productImages.split(';')
  return (
    <div className="relative rounded-lg p-5 bg-cardBg  w-[300px] flex flex-col flex-wrap text-foreground pt-20 bg-white shadow shadow-gray-500">
      <Image
        src={productImages[0]}
        width={150}
        height={150}
        alt=""
        className="rounded-full object-cover absolute -top-20 mx-auto right-0 left-0 border-4 border-white shadow-lg shadow-gray-500"
      />
      <h3 className={`${baloo.className} font-extrabold mx-auto mb-4`}>{product.productName}</h3>
      <p>{product.productDescription}</p>
      <div className=" flex  flex-col flex-1 justify-end">
        <div className="flex items-end mt-3 ">
          <p className="font-bold">R$ </p>
          <p className="ml-3 text-3xl -mb-1">{product.price.toFixed(2)}</p>
        </div>
        <div className="flex flex-col  mt-5 gap-2 justify-end">
          <button
            className="w-full bg-yellow-700 text-white mx-auto  p-2 rounded-lg cursor-pointer hover:opacity-50"
            onClick={() => {
              if (checkIfAlreadyInCart(product.id)) return alert('Produto já adicionado ao carrinho.')
              addToCart(product)
            }}
          >
            Adicionar ao carrinho
          </button>
          <button
            className="w-full bg-yellow-700 text-white mx-auto  p-2 rounded-lg cursor-pointer hover:opacity-50"
            onClick={() => goToProductPage(product.id)}
          >
            Ver mais
          </button>
        </div>
      </div>
    </div>
  )
}
