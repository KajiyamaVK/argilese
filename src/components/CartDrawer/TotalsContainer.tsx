import { PurchaseContext } from '@/contexts/PurchaseContext'
import { useContext } from 'react'

export function TotalsContainer() {
  const { totalCartItemsPrice, totalCartQty, deliveryData, totalPurchaseAmount } = useContext(PurchaseContext)

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
        {(deliveryData.price || 0) > 0 && (
          <>
            <tr>
              <td className="pr-4 text-right font-bold">Frete:</td>
              <td>{'R$ ' + deliveryData.price?.toFixed(2).replace('.', ',') || <i>(A calcular)</i>}</td>
            </tr>
            <tr>
              <td className="mt-5 pr-4 text-right font-bold">Total da compra:</td>
              <td>{'R$ ' + totalPurchaseAmount.toFixed(2).replace('.', ',')}</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  )
}
