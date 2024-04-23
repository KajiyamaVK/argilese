export interface IPurchaseDelivery {
  id?: number
  customerName: string
  customerWhatsapp: string
  customerEmail: string
  cep: string
  address: string
  complement: string
  addressNumber: string
  neighborhood: string
  city: string
  state: string
  price: number | null
  type: TDelivery
  customPrice: string
  totalWeight: number
  totalHeight: number
  totalWidth: number
  totalLength: number
  discount: string
  currency: string
  deliveryDays: number
  deliveryRange: DeliveryRange
  customDeliveryDays: number
  customDeliveryRange: DeliveryRange
  packages: Package[]
  additionalServices: AdditionalServices
  company: Company
}

interface DeliveryRange {
  min: number
  max: number
}

interface Package {
  price?: string // Opcional porque nem todos os pacotes têm preço.
  discount?: string // Opcional porque nem todos os pacotes têm desconto.
  format: string
  weight: string
  insurance_value: string
  dimensions: Dimensions
}

export type TDelivery = 'PAC' | 'SEDEX' | ''

interface Dimensions {
  height: number
  width: number
  length: number
}

interface AdditionalServices {
  receipt: boolean
  own_hand: boolean
  collect: boolean
}

interface Company {
  id: number
  name: string
  picture: string
}
