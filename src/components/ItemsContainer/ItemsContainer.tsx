'use client'
import { ItemCard } from '@/components/ItemCard/ItemCard'
import { IProduct } from '@/models/products'
import { baloo } from '@/utils/fontsExports/fonts'
import { getProducts } from './functions'
import { useContext, useEffect, useState } from 'react'
import { PurchaseContext } from '@/contexts/PurchaseContext'

export function ItemsContainer() {
  const [products, setProducts] = useState<IProduct[]>([])
  const { cart } = useContext(PurchaseContext)

  useEffect(() => {
    async function fetchData() {
      if (cart.length === 0) {
        await getProducts().then((result) => {
          if (result.isError) {
            console.error('Erro ao buscar produtos', result.message)
            return
          }
          setProducts(result.data)
        })
      }
    }
    fetchData()
  }, [cart])
  return (
    <div className=" mt-10 ">
      <h2
        className={`mb-10 ml-10 w-fit border border-x-0 border-t-0 border-b-gray-400 ${baloo.className} font-extrabold`}
      >
        Nossos projetos{'   '}
      </h2>
      <div className="flex flex-wrap justify-center gap-28 p-20 md:justify-start md:gap-x-5 md:gap-y-28">
        {products.length > 0 &&
          products.map((product) => {
            return <ItemCard key={product.id} product={product} />
          })}
      </div>
    </div>
  )
}
