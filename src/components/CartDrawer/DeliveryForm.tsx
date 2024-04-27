'use client'
import { FaSpinner } from 'react-icons/fa'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../Button/Button'
import { formatCEP, formatPhone, formatToNumber } from '@/utils/maskFunctions/'

import { useContext, useEffect, useState } from 'react'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { TotalsContainer } from './TotalsContainer'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Skeleton } from '../ui/skeleton'
import { TDelivery } from '@/models/deliveries'
import { getCitiesByUF, savePurchaseDelivery } from './functions'
import { getDeliveryPrices } from '@/app/[itemId]/functions'
import { IAddress } from '@mercadopago/sdk-react/bricks/payment/type'

const DeliveryFormSchema = z.object({
  customerName: z.string({ required_error: 'O nome é necessário para a entrega.' }),
  email: z
    .string({ required_error: 'O e-mail é necessário para o envio dos dados da compra.' })
    .email('O formato do e-mail é inválido.'),
  cep: z.string({ required_error: 'O CEP é necessário para o cálculo do frete.' }),
  address: z.string({ required_error: 'O endereço é necessário para a entrega.' }),
  number: z.string({ required_error: 'O número é necessário para a entrega.' }),
  complement: z.string().optional(),
  neighborhood: z.string({ required_error: 'O bairro é necessário para a entrega.' }),
  city: z.string({ required_error: 'Selecione a cidade da lista acima' }),
  state: z.string({ required_error: 'Selecione o estado da lista acima' }),
  customerWhatsapp: z.string().nullable(),
})

const ufs = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

export type DeliveryFormType = z.infer<typeof DeliveryFormSchema>

interface IGetFreteResponse {
  pacPrice: string
  pacDeliveryTime: string
  sedexPrice: string
  sedexDeliveryTime: string
}

export function DeliveryForm({ purchaseId }: { purchaseId: number }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setFocus,
    watch,
  } = useForm<DeliveryFormType>({
    resolver: zodResolver(DeliveryFormSchema),
  })

  const { setCurrentStep, deliveryData, setDeliveryData, currentStep } = useContext(PurchaseContext)
  const { sendAlert } = useContext(AlertDialogContext)
  const [cities, setCities] = useState<string[]>([])
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  //const [chosenDelivery, setChosenDelivery] = useState<TDelivery>('')
  const [deliveriesPricesData, setDeliveriesPricesData] = useState<IGetFreteResponse | null>({
    pacPrice: '',
    pacDeliveryTime: '',
    sedexPrice: '',
    sedexDeliveryTime: '',
  })

  useEffect(() => {
    handleStateChange()
    // eslint-disable-next-line
  }, [watch('state')])

  function goBackToCart() {
    setCurrentStep('cart')
  }

  async function handleStateChange() {
    setValue('city', '')
    setCities([])
    await getCitiesByUF(watch('state')).then((data) => {
      setCities(data.data)
    })
  }

  async function onSubmit(data: DeliveryFormType) {
    const newDeliveryData = {
      ...deliveryData,
      cep: formatToNumber(data.cep),
      deliveryPrice: deliveryData.price,
      deliveryTime: parseInt(
        deliveryData.type === 'PAC'
          ? deliveriesPricesData?.pacDeliveryTime || '0'
          : deliveriesPricesData?.sedexDeliveryTime || '0',
      ),
      address: data.address,
      addressNumber: data.number,
      complement: data.complement || '',
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      customerName: data.customerName,
      customerEmail: data.email,
      customerWhatsapp: data.customerWhatsapp ? formatToNumber(data.customerWhatsapp) : '',
    }

    await setDeliveryData(newDeliveryData)

    //const receivedInsertedValue: IDBResponse = await insertPurchase({ deliveryData: newDeliveryData, cartData: cart })
    await savePurchaseDelivery({ data: newDeliveryData, purchaseId })

    setCurrentStep('payment')
  }

  async function getDeliveryPrice() {
    await getDeliveryPrices(
      watch('cep'),
      deliveryData.totalHeight,
      deliveryData.totalWidth,
      deliveryData.totalLength,
      deliveryData.totalWeight,
    )
      .then((data) => {
        if (data.isError) throw new Error(data.message)
        setDeliveriesPricesData(data.data)
      })
      .catch((error) => {
        console.error(error)
        alert('Erro ao calcular frete: ' + error)
      })
  }

  // eslint-disable-next-line
  async function getAddressByCep(cep: string): Promise<IAddress | any> {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        sendAlert({
          message:
            'Ué. Está parecendo que não estamos conseguindo conectar ao serviço dos Correios. Entre com seu endereço manualmente, por gentileza.',
          type: 'error',
        })
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      return { error: 'Error fetching data: ' + error }
    }
  }

  async function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value
    //
    const cep = formatCEP(value)

    setValue('cep', cep)

    if (value.length === 9) {
      setIsLoadingAddress(true)

      await getDeliveryPrice()

      const address = await getAddressByCep(formatToNumber(cep))

      if (address.error) {
        //return alert('CEP não encontrado. Ele está certo?')
        sendAlert({
          message: 'CEP não encontrado. Ele está correto?',
          type: 'OK',
        })
      }

      setValue('state', address.uf)
      setValue('address', address.logradouro)
      setValue('neighborhood', address.bairro)
      setFocus('number')
      setIsLoadingAddress(false)
      setTimeout(() => {
        setValue('city', address.localidade)
      }, 500)
    } else {
      setDeliveriesPricesData(null)
    }
  }

  return (
    <div className={`p-5 ${currentStep !== 'delivery' && 'hidden'}`}>
      <h2>DADOS DE ENTREGA</h2>
      <form className="flex flex-col gap-5 p-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="cep">Digite seu cep</label>
          <div className="flex items-center gap-5">
            <input
              type="text"
              id="cep"
              className="w-32 rounded-lg border border-gray-300 p-3"
              {...register('cep', {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleCepChange(e),
              })}
            />
            {isLoadingAddress && <FaSpinner className="animate-spin" size={24} />}
          </div>
          {errors.cep && <p className="text-destructive">{errors.cep.message}</p>}
        </div>

        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="address">Endereço</label>
          <input
            type="text"
            id="address"
            className="w-full rounded-lg border border-gray-300 p-3"
            disabled={(watch('cep') && watch('cep').length === 9) || true}
            {...register('address')}
          />
          {errors.address && <p className="text-destructive">{errors.address.message}</p>}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col items-start  gap-3">
            <label htmlFor="number">Número</label>
            <input
              type="text"
              id="number"
              className="w-32 rounded-lg border border-gray-300 p-3"
              {...register('number')}
            />
            {errors.number && <p className="text-destructive">{errors.number.message}</p>}
          </div>

          <div className="flex flex-col items-start  gap-3">
            <label htmlFor="complement">Complemento</label>
            <input
              type="text"
              id="complement"
              className="w-full rounded-lg border border-gray-300 p-3"
              {...register('complement')}
            />
          </div>
        </div>

        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="neighborhood">Bairro</label>
          <input
            type="text"
            id="neighborhood"
            className="w-full rounded-lg border border-gray-300 p-3"
            {...register('neighborhood')}
          />
          {errors.neighborhood && <p className="text-destructive">{errors.neighborhood.message}</p>}
        </div>
        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="state">Estado</label>
          <select
            id="state"
            className="w-full cursor-not-allowed rounded-lg border border-gray-300 p-3 disabled:opacity-100"
            title="Preencha o CEP para preencher este campo"
            disabled
            {...register('state')}
            onChange={handleStateChange}
          >
            <option value="">Selecione o estado</option>
            {ufs.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.value} - {estado.label}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-destructive">{errors.state.message}</p>}
        </div>
        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="city">Cidade</label>
          <select
            id="city"
            className="w-full cursor-not-allowed rounded-lg border border-gray-300 p-3 disabled:opacity-100"
            disabled
            title="Preencha o CEP para preencher este campo"
            {...register('city')}
          >
            <option value="">Selecione a cidade</option>
            {cities.length > 0 &&
              cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
          {errors.city && <p className="text-destructive">{errors.city.message}</p>}
        </div>

        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="name">Nome do destinatário</label>
          <input
            type="text"
            id="name"
            className="w-full rounded-lg border border-gray-300 p-3"
            {...register('customerName')}
          />
          {errors.customerName && <p className="text-destructive">{errors.customerName.message}</p>}
        </div>

        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            className="w-full rounded-lg border border-gray-300 p-3"
            {...register('email')}
          />
          {errors.email && <p className="text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="customerWhatsapp">Whatsapp</label>
          <input
            type="text"
            id="customerWhatsapp"
            className="w-full rounded-lg border border-gray-300 p-3"
            {...register('customerWhatsapp', {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = formatPhone(e.target.value)
              },
            })}
          />
          {errors.customerWhatsapp && <p className="text-destructive">{errors.customerWhatsapp.message}</p>}
        </div>

        {watch('cep') && watch('cep').length === 9 && (
          <div className="flex flex-col gap-3">
            <b>Escolha o frete:</b>

            <div>
              <RadioGroup
                value={deliveryData.type}
                onValueChange={(e: TDelivery) => {
                  setDeliveryData({
                    ...deliveryData,
                    price:
                      e === 'SEDEX'
                        ? Number(deliveriesPricesData?.sedexPrice.replace(',', '.'))
                        : Number(deliveriesPricesData?.pacPrice.replace(',', '.')),
                    type: e as TDelivery,
                  })
                }}
                disabled={!deliveriesPricesData?.sedexPrice}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SEDEX" id="sedexChk" />
                  <Label htmlFor="sedexChk">
                    <table>
                      <tbody>
                        <tr>
                          <td className="w-20">SEDEX</td>
                          <td>
                            {!deliveriesPricesData?.sedexPrice ? (
                              <Skeleton className="h-4 w-40 bg-gray-300" />
                            ) : (
                              <span>
                                R$ {deliveriesPricesData?.sedexPrice.replace('.', ',')} -{' '}
                                {deliveriesPricesData?.sedexDeliveryTime} dias úteis
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PAC" id="pacChk" />
                  <Label htmlFor="pacChk">
                    <table>
                      <tbody>
                        <tr>
                          <td className="w-20">PAC</td>
                          <td>
                            {!deliveriesPricesData?.pacPrice ? (
                              <Skeleton className="h-4 w-40 bg-gray-300" />
                            ) : (
                              <span>
                                R$ {deliveriesPricesData?.pacPrice.replace('.', ',')} -{' '}
                                {deliveriesPricesData?.pacDeliveryTime} dias úteis
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        <TotalsContainer />

        {}

        <Button type="button" className="w-full" onClick={goBackToCart}>
          Voltar para os itens
        </Button>
        <Button
          type="submit"
          className="w-full"
          disabled={
            !deliveryData.type ||
            !watch('customerName') ||
            !watch('email') ||
            !watch('cep') ||
            !watch('address') ||
            !watch('number') ||
            !watch('neighborhood') ||
            !watch('city') ||
            !watch('state')
          }
        >
          Ir para o pagamento
        </Button>
      </form>
    </div>
  )
}
