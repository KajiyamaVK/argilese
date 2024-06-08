'use client'
import Image from 'next/image'
import { baloo } from '@/utils/fontsExports/fonts'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/models/products'
import React, { useContext, useState } from 'react'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { GeneralContext } from '@/contexts/GeneralContext'
import { Button } from '../Button/Button'

interface IItemCard {
  product: IProduct
}

export function ItemCard({ product }: IItemCard) {
  const { addToCart, checkIfAlreadyInCart } = useContext(PurchaseContext)
  const { sendAlert } = useContext(AlertDialogContext)
  const { isAdmin } = useContext(GeneralContext)

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  function goToProductPage(id: number) {
    setIsLoading(true)
    router.push(`/${id}`)
  }

  const productImages = product.productImages.split(';')
  if (isAdmin || product.productName !== 'Produto teste') {
    const descriptionLines = product.productDescription
      .split('\n')
      .map((line, index) => <React.Fragment key={index}>{line.trim() === '' ? <br /> : <p>{line}</p>}</React.Fragment>)
    return (
      <div className=" relative flex w-[300px]  flex-col flex-wrap rounded-lg bg-white p-5 pt-20 text-foreground shadow shadow-gray-500">
        <Image
          src={productImages[0]}
          width={150}
          height={150}
          alt=""
          className="absolute inset-x-0 -top-20 mx-auto max-h-[150px] min-h-[150px] rounded-full border-4 border-white object-cover shadow-lg shadow-gray-500"
        />
        <h3 className={`${baloo.className} mx-auto mb-4 font-extrabold`}>{product.productName}</h3>
        <p>{descriptionLines}</p>
        <div className=" flex  flex-1 flex-col justify-end">
          <div className="mt-3 flex items-end ">
            <p className="font-bold">R$ </p>
            <p className="-mb-1 ml-3 text-3xl">{product.price.toFixed(2)}</p>
          </div>
          <div className="mt-5 flex  flex-col justify-end gap-2">
            {!product.isSold ? (
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
            ) : (
              <p>
                <b>ESGOTADO</b>
              </p>
            )}
            <Button
              className="mx-auto w-full cursor-pointer rounded-lg  bg-yellow-700 p-2 text-white hover:opacity-50"
              onClick={() => goToProductPage(product.id)}
              isLoading={isLoading}
            >
              Ver mais
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
