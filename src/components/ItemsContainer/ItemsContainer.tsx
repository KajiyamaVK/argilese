import { ItemCard } from '@/components/ItemCard/ItemCard'
import { IProduct } from '@/models/products'
import { baloo } from '@/utils/maskFunctions'
import { getProducts } from './functions'
import { unstable_noStore } from 'next/cache'
export const fetchCache = 'force-no-store'

export async function ItemsContainer() {
  unstable_noStore() // To not cache the page
  const result = await getProducts()

  const products: IProduct[] = result.data
  return (
    <div className=" mt-10 ">
      <h2
        className={`mb-10 ml-10 w-fit border border-x-0 border-t-0 border-b-gray-400 ${baloo.className} font-extrabold`}
      >
        Nossos projetos{'   '}
      </h2>
      <div className="flex flex-wrap justify-center gap-28 p-20 md:justify-start md:gap-5">
        {products.length > 0 &&
          products.map((product) => {
            return <ItemCard key={product.id} product={product} />
          })}
      </div>
    </div>
  )
}
