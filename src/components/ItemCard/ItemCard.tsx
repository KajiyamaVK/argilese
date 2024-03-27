import Image from 'next/image'
import product from '/public/products/item1.jpg'
import { baloo } from '@/utils/functions'

interface IItemCard {
  itemName?: string
  description?: string
  itemUrl?: string
  price?: number
}
export function ItemCard({ itemName, description, itemUrl, price }: IItemCard) {
  return (
    <div className="relative rounded-lg p-5 bg-cardBg  w-[300px] flex flex-col flex-wrap text-foreground pt-20">
      <Image
        src={itemUrl ?? product}
        width={150}
        height={150}
        alt=""
        className="rounded-full object-cover absolute -top-14 translate-x-1/3 border-4 border-white shadow-lg shadow-gray-500"
      />
      <h3 className={`${baloo.className} font-extrabold mx-auto mb-4`}>{itemName ?? 'Nome do item'}</h3>
      <p>{description ?? 'Um resumo da descrição do item, porém, não muito longo'}</p>
      <div className="flex items-end mt-3 ">
        <p className="font-bold">R$ </p>
        <p className="ml-3 text-3xl -mb-1">{price?.toFixed(2) || (99.9).toFixed(2)}</p>
      </div>
      <div className="flex justify-evenly mt-5">
        <button className="w-[100px] bg-yellow-700 text-white mx-auto  p-2 rounded-lg cursor-pointer hover:opacity-50">
          Comprar
        </button>
        <button className="w-[100px] bg-yellow-700 text-white mx-auto  p-2 rounded-lg cursor-pointer hover:opacity-50">
          Ver mais
        </button>
      </div>
    </div>
  )
}
