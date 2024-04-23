import { IPurchaseDelivery } from './deliveries'
import { IProduct } from './products'

export interface ITotals {
  purchaseAmount: number
  discount: number
  delivery: number
  productsQty: number
}

export interface IPurchase {
  id?: number
  deliveryData: IPurchaseDelivery
  cartData: IProduct[]
  //totals: ITotals
}
