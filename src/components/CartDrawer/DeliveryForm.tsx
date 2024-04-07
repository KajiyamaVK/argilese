'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../Button/Button'
import { formatCEP, formatToNumber } from '@/utils/maskFunctions'
import { useContext, useEffect, useState } from 'react'
import { CartContext } from '@/contexts/CartContext'
import { getAddressByCep, getCityByUf } from '@/utils/fetchFunctions'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { TotalsContainer } from './TotalsContainer'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Skeleton } from '../ui/skeleton'

const DeliveryFormSchema = z.object({
  name: z.string({ required_error: 'O nome é necessário para a entrega.' }),
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
  whatsapp: z.string().optional(),
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

type TDelivery = 'PAC' | 'SEDEX' | ''

export function DeliveryForm() {
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

  const { setCurrentStep, setDeliveryPrice, totalWeight, totalHeight, totalLength, totalWidth, cart } =
    useContext(CartContext)
  const { sendAlert } = useContext(AlertDialogContext)
  const [cities, setCities] = useState<string[]>([])

  const [chosenDelivery, setChosenDelivery] = useState<TDelivery>('')
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false)
  const [deliveriesData, setDeliveriesData] = useState<IGetFreteResponse | null>({
    pacPrice: '',
    pacDeliveryTime: '',
    sedexPrice: '',
    sedexDeliveryTime: '',
  })

  useEffect(() => {
    if (chosenDelivery === 'PAC') {
      setDeliveryPrice(parseFloat(deliveriesData?.pacPrice || '0'))
    } else if (chosenDelivery === 'SEDEX') {
      setDeliveryPrice(parseFloat(deliveriesData?.sedexPrice || '0'))
    }
    // eslint-disable-next-line
  }, [chosenDelivery, deliveriesData])

  useEffect(() => {
    async function handleCitySelect() {
      await getCityByUf(watch('state')).then((cities) => {
        const oldCityValue = watch('city')
        setCities(cities)
        setValue('city', oldCityValue)
      })
    }
    handleCitySelect()

    // eslint-disable-next-line
  }, [watch('state')])

  function goBackToCart() {
    setCurrentStep('cart')
  }

  async function onSubmit(data: DeliveryFormType) {
    const deliveryInfo = {
      cep: data.cep,
      deliveryPrice: parseFloat(
        chosenDelivery === 'PAC' ? deliveriesData?.pacPrice || '0' : deliveriesData?.sedexPrice || '0',
      ),
      deliveryType: chosenDelivery,
      deliveryTime: parseInt(
        chosenDelivery === 'PAC' ? deliveriesData?.pacDeliveryTime || '0' : deliveriesData?.sedexDeliveryTime || '0',
      ),
      customerName: data.name,
      customerWhatsapp: data.whatsapp,
      customerEmail: data.email,
      address: data.address,
      addressNumber: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    }

    const productsId = cart.map((product) => product.id)

    fetch('/api/purchases', {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify({
        action: 'openPurchase',
        data: {
          deliveryInfo,
          productsId,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setCurrentStep('payment')
      })
      .catch((error) => {
        console.error(error)
        alert('Erro ao enviar dados de entrega: ' + error)
      })
  }

  async function getDeliveryPrice() {
    await fetch(`/api/calculaFrete`, {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify({
        width: totalWidth.toString(),
        height: totalHeight.toString(),
        length: totalLength.toString(),
        weight: totalWeight.toString(),
        cep: watch('cep'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg) throw new Error(data.msg)
        setDeliveriesData(data)
      })
      .then(() => setShowSkeleton(false))
      .catch((error) => {
        console.error(error)
        alert('Erro ao calcular frete: ' + error)
      })
  }

  async function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = formatCEP(e.target.value)
    e.target.value = value

    if (value.length === 9) {
      setShowSkeleton(true)
      getDeliveryPrice()

      const address = await getAddressByCep(formatToNumber(value))

      if (address.error) {
        //return alert('CEP não encontrado. Ele está certo?')
        sendAlert({
          message: 'CEP não encontrado. Ele está correto?',
          type: 'OK',
        })
      }
      console.log(address.localidade)
      setValue('address', address.logradouro)
      setValue('neighborhood', address.bairro)
      setValue('state', address.uf)
      setValue('city', address.localidade)
      setFocus('number')
    } else {
      setDeliveriesData(null)
      setChosenDelivery('')
    }
  }

  return (
    <div className="p-5">
      <h2>DADOS DE ENTREGA</h2>
      <form className="flex flex-col gap-5 p-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="cep">Digite seu cep</label>
          <input
            type="text"
            id="cep"
            className="w-32 rounded-lg border border-gray-300 p-3"
            {...register('cep', {
              onChange: (e) => {
                handleCepChange(e)
              },
            })}
          />
          {errors.cep && <p className="text-destructive">{errors.cep.message}</p>}
        </div>

        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="address">Endereço</label>
          <input
            type="text"
            id="address"
            className="w-full rounded-lg border border-gray-300 p-3"
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
          <select id="state" className="w-full rounded-lg border border-gray-300 p-3" {...register('state')}>
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
            className="w-full rounded-lg border border-gray-300 p-3"
            disabled={watch('state') === ''}
            title={watch('state') === '' ? 'Selecione o estado antes de preencher a cidade.' : ''}
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
          <input type="text" id="name" className="w-full rounded-lg border border-gray-300 p-3" {...register('name')} />
          {errors.name && <p className="text-destructive">{errors.name.message}</p>}
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

        {watch('cep') && watch('cep').length === 9 && (
          <div className="flex flex-col gap-3">
            <b>Escolha o frete:</b>

            <div>
              <RadioGroup
                value={chosenDelivery}
                onValueChange={(e) => {
                  setChosenDelivery(e as TDelivery)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SEDEX" id="sedexChk" />
                  <Label htmlFor="sedexChk">
                    <table>
                      <tr>
                        <td className="w-20">SEDEX</td>
                        <td>
                          {showSkeleton && (!deliveriesData || !deliveriesData.sedexPrice) ? (
                            <Skeleton className="h-4 w-40 bg-gray-300" />
                          ) : (
                            <span>
                              R$ {deliveriesData?.sedexPrice.replace('.', ',')} - {deliveriesData?.sedexDeliveryTime}{' '}
                              dias úteis
                            </span>
                          )}
                        </td>
                      </tr>
                    </table>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PAC" id="pacChk" />
                  <Label htmlFor="pacChk">
                    <table>
                      <tr>
                        <td className="w-20">PAC</td>
                        <td>
                          {showSkeleton ? (
                            <Skeleton className="h-4 w-40 bg-gray-300" />
                          ) : (
                            <span>
                              R$ {deliveriesData?.pacPrice.replace('.', ',')} - {deliveriesData?.pacDeliveryTime} dias
                              úteis
                            </span>
                          )}
                        </td>
                      </tr>
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
        <Button type="submit" className="w-full" disabled={!chosenDelivery}>
          Ir para o pagamento
        </Button>
      </form>
    </div>
  )
}
