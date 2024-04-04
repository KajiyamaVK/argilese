import { CalculaFrete } from '@/components/CalculaFrete/CalculaFrete'
import { ImagesGallery } from '@/components/ImageGallery/ImagesGallery'
import { IProduct } from '@/models/products'
import { baloo } from '@/utils/maskFunctions'
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
    <div className="flex w-full flex-col p-20 lg:flex-row lg:gap-5">
      <div className="mx-auto w-full lg:w-1/2  ">
        <BackButton />
        <ImagesGallery images={productImages} />
      </div>
      <div className="mx-auto mt-5 max-w-[300px] lg:flex lg:w-1/2 lg:min-w-[500px] lg:flex-col ">
        <h1 className={`border-b border-gray-500 text-[2rem] ${baloo.className}`}>{product.productName}</h1>
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
          {product.diameter > 0 && (
            <tr>
              <td>Diametro:</td>
              <td>{product.diameter}cm</td>
            </tr>
          )}
          {product.milliliters > 0 && (
            <tr>
              <td>Capacidade:</td>
              <td>{product.milliliters}ml</td>
            </tr>
          )}
          <tr>
            <td>Peso:</td>
            <td>{product.weight}Kg</td>
          </tr>
        </table>

        <div className="mt-5 flex items-end gap-2">
          <span className="mb-px mt-5">R$</span>
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
