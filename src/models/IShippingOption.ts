export interface IShippingOption {
  id: number
  name: string
  price: string
  custom_price: string
  discount: string
  currency: string
  delivery_time: number
  delivery_range: DeliveryRange
  custom_delivery_time: number
  custom_delivery_range: DeliveryRange
  packages: Package[]
  additional_services: AdditionalServices
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
