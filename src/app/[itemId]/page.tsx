import { CalculaFrete } from '@/components/CalculaFrete/CalculaFrete'
import { ImagesGallery } from '@/components/ImageGallery/ImagesGallery'
import { IProduct } from '@/models/products'
import { baloo } from '@/utils/functions'
export default async function ItemPage({ params }: { params: { itemId: number } }) {
  const { itemId } = params

  let product: IProduct = {} as IProduct

  async function getProductById() {
    await fetch(`${process.env.API_URL}/api/products`, {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({ action: 'getProductById', id: itemId }),
    })
      .then((res) => res.json())
      .then((data) => (product = data))
  }

  await getProductById()

  if (!product) {
    return <div>Produto não encontrado</div>
  }
  const productImages = product.productImages.split(';')
  return (
    <div className="w-full p-20 flex flex-col lg:flex-row lg:gap-5 ">
      <div className="w-full mx-auto lg:w-1/2 flex lg:justify-end justify-center">
        <ImagesGallery images={productImages} />
      </div>
      <div className="max-w-[300px] mx-auto lg:w-1/2 lg:flex lg:flex-col lg:min-w-[500px]  ">
        <h1 className={`text-[2rem] ${baloo.className}`}>{product.productName}</h1>
        <p>{product.productDescription}</p>
        <p className="mt-2">
          <b>Dimensões:</b> {product.height}x{product.width}x{product.length}cm
        </p>
        <p>
          <b>Peso: </b>
          {product.weight}kg
        </p>
        <div className="flex gap-2 items-end">
          <span className="mb-[1px] mt-5">R$</span>
          <span className="text-3xl">{product.price.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex">
          <CalculaFrete height={product.height} width={product.width} length={product.length} weight={product.weight} />
        </div>

        <button className="bg-yellow-700 text-white p-2 rounded-md mt-10 hover:opacity-75">Comprar</button>
      </div>
    </div>
  )
}
