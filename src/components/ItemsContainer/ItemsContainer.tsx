import { ItemCard } from '@/components/ItemCard/ItemCard'

interface IProductShow {
  id: number
  productName: string
  productDescription: string
  price: number
  productImages: string
}

let products: IProductShow[] = []
export async function ItemsContainer() {
  async function getAllProducts() {
    try {
      console.log('process.env.API_URL', process.env.API_URL)
      const response = await fetch(`${process.env.API_URL}/api/products`, {
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify({
          action: 'getProductsAvailable',
          id: 0,
        }),
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
  console.log('products', products)
  return (
    <div className=" mt-10 ">
      <h2 className="ml-10 border w-fit border-b-gray-400 border-r-0 border-l-0 border-t-0 mb-10">
        Nossos projetos{'   '}
      </h2>
      <div className="p-20 flex flex-wrap justify-center md:justify-start">
        {products.length > 0 &&
          products.map((product) => {
            const productImages = product.productImages.split(';')

            return (
              <ItemCard
                key={product.id}
                id={product.id}
                description={product.productDescription}
                itemName={product.productName}
                itemUrl={productImages[0]}
                price={product.price}
              />
            )
          })}
      </div>
    </div>
  )
}
