import { CalculaFrete } from '@/components/CalculaFrete/CalculaFrete'
import { ImagesGallery } from '@/components/ImageGallery/ImagesGallery'
import { IProduct } from '@/models/products'
import { baloo } from '@/utils/functions'
import { AddToCartButton } from './AddToCartButton'
import BackButton from '@/components/BackButton/BackButton'
export default async function ItemPage({ params }: { params: { itemId: number } }) {
  const { itemId } = params

  let product: IProduct = {} as IProduct

  async function getProductById() {
    await fetch(`${process.env.API_URL}/api/products`, {
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
    <div className="w-full p-20 flex flex-col lg:flex-row lg:gap-5">
      <div className="w-full mx-auto lg:w-1/2  ">
        <BackButton />
        <ImagesGallery images={productImages} />
      </div>
      <div className="max-w-[300px] mx-auto lg:w-1/2 lg:flex lg:flex-col lg:min-w-[500px] mt-5 ">
        <h1 className={`text-[2rem] border-b border-gray-500 ${baloo.className}`}>{product.productName}</h1>
        <p>{product.productDescription}</p>
        <p className="mt-5">
          <b>Medidas aproximadas</b>
        </p>
        <table>
          <tr>
            <td className="pr-20">Altura:</td>
            <td>{product.height}cm</td>
          </tr>
          <tr>
            <td>Largura:</td>
            <td>
              {product.width}cm {product.hasHandle && 'com alça'}
            </td>
          </tr>
          {product.length > 0 && (
            <tr>
              <td>Comprimento:</td>
              <td>{product.length}cm</td>
            </tr>
          )}
          <tr>
            <td>Peso:</td>
            <td>{product.weight}Kg</td>
          </tr>
        </table>

        <div className="flex gap-2 items-end mt-5">
          <span className="mb-[1px] mt-5">R$</span>
          <span className="text-3xl">{product.price.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex">
          <CalculaFrete
            height={product.height.toString()}
            width={product.width.toString()}
            length={product.length.toString()}
            weight={product.weight.toString()}
          />
        </div>

        {/* <button className="bg-yellow-700 text-white p-2 rounded-md mt-10 hover:opacity-75 w-full">
          Adicionar ao carrinho
        </button> */}
        <AddToCartButton product={product} />
      </div>
    </div>
  )
}
