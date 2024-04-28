import { PurchaseContext } from '@/contexts/PurchaseContext'
import { useContext } from 'react'

export function TotalsContainer({ deliveryPrice }: { deliveryPrice: string }) {
  const { totalCartItemsPrice, totalCartQty } = useContext(PurchaseContext)
  if (deliveryPrice === undefined) return null
  const deliveryPriceConverted = Number(deliveryPrice.replace(',', '.'))

  const subTotal = deliveryPriceConverted + totalCartItemsPrice

  return (
    <table className="mt-5 w-full">
      <tbody>
        <tr>
          <td className="w-fit pr-4 text-right font-bold">Quantidade de itens:</td>
          <td>{totalCartQty}</td>
        </tr>
        <tr>
          <td className="pr-4 text-right font-bold">Total dos itens:</td>
          <td>R$ {totalCartItemsPrice.toFixed(2).replace('.', ',')}</td>
        </tr>
        <tr>
          <td className="pr-4 text-right font-bold">Frete:</td>
          <td>{'R$ ' + deliveryPriceConverted?.toFixed(2).replace('.', ',') || <i>(A calcular)</i>}</td>
        </tr>
        <tr>
          <td className="mt-5 pr-4 text-right font-bold">Total da compra:</td>
          <td>{'R$ ' + subTotal.toFixed(2).replace('.', ',')}</td>
        </tr>
      </tbody>
    </table>
  )
}
