import { ItemCard } from '@/components/ItemCard/ItemCard'
import { IProduct } from '@/models/products'
import { baloo } from '@/utils/maskFunctions'

let products: IProduct[] = []
export async function ItemsContainer() {
  async function getAllProducts() {
    try {
      const response = await fetch(`${process.env.API_URL}/api/products`, {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data) {
        // This check can be more sophisticated based on your API response structure
        products = data
      } else {
        console.error('Received empty or invalid JSON.')
      }
      // eslint-disable-next-line
    } catch (error: any) {
      console.error('Error fetching products:', error.message)
    }
  }

  await getAllProducts()

  return (
    <div className=" mt-10 ">
      <h2
        className={`ml-10 border w-fit border-b-gray-400 border-r-0 border-l-0 border-t-0 mb-10 ${baloo.className} font-extrabold`}
      >
        Nossos projetos{'   '}
      </h2>
      <div className="p-20 flex flex-wrap justify-center md:justify-start gap-28 md:gap-5">
        {products.length > 0 &&
          products.map((product) => {
            return <ItemCard key={product.id} product={product} />
          })}
      </div>
    </div>
  )
}
