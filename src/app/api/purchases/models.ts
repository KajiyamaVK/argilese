export type TActions = 'openPurchase'
type TDeliveryType = 'PAC' | 'Sedex'

interface IOpenPurchaseDelivery {
  cep: string
  deliveryPrice: number
  deliveryType: TDeliveryType
  deliveryTime: number
  customerName: string
  customerWhatsapp: string | null
  customerEmail: string
  address: string
  addressNumber: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface IOpenPurchase {
  action: TActions
  data: {
    productsId: number[]
    newDeliveryData: IOpenPurchaseDelivery
  }
}
