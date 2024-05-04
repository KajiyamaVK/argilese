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
import { Skeleton } from '../ui/skeleton'
import { savePurchaseDelivery } from './functions'
import { getDeliveryPrices } from '@/app/[itemId]/functions'
import { IPurchaseDelivery, TDelivery } from '@/models/deliveries'
import { getAddressByCep } from './functions'
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
  deliveryType: z.string(),
  deliveryPrice: z.string(),
})

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
    getValues,
  } = useForm<DeliveryFormType>({
    resolver: zodResolver(DeliveryFormSchema),
  })

  const { setCurrentStep, deliveryData, setDeliveryData, currentStep } = useContext(PurchaseContext)
  const { sendAlert } = useContext(AlertDialogContext)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [getDeliveryPriceTries, setGetDeliveryPriceTries] = useState(0)

  //const [chosenDelivery, setChosenDelivery] = useState<TDelivery>('')
  const [deliveriesPricesData, setDeliveriesPricesData] = useState<IGetFreteResponse | null>({
    pacPrice: '',
    pacDeliveryTime: '',
    sedexPrice: '',
    sedexDeliveryTime: '',
  })

  useEffect(() => {
    if (currentStep === 'delivery') {
      resetDeliveryForm()
    }
    // eslint-disable-next-line
  }, [currentStep])

  const deliveryType = watch('deliveryType')

  useEffect(() => {
    // Lógica que será executada cada vez que deliveryType mudar
    setValue(
      'deliveryPrice',
      deliveryType === 'SEDEX' ? deliveriesPricesData!.sedexPrice : deliveriesPricesData!.pacPrice,
    )
  }, [deliveryType]) // eslint-disable-line

  function goBackToCart() {
    setCurrentStep('cart')
  }

  function resetDeliveryForm() {
    setValue('customerName', '')
    setValue('email', '')
    setValue('cep', '')
    setValue('address', '')
    setValue('number', '')
    setValue('complement', '')
    setValue('neighborhood', '')
    setValue('city', '')
    setValue('state', '')
    setValue('customerWhatsapp', '')
    setValue('deliveryType', '')
    setValue('deliveryPrice', '')

    setDeliveriesPricesData({
      pacPrice: '',
      pacDeliveryTime: '',
      sedexPrice: '',
      sedexDeliveryTime: '',
    })

    console.log(getValues())
  }

  async function onSubmit(data: DeliveryFormType) {
    const newDeliveryData: IPurchaseDelivery = {
      ...deliveryData,
      cep: formatToNumber(data.cep),
      type: data.deliveryType as TDelivery,

      price:
        data.deliveryType === 'SEDEX'
          ? Number(deliveriesPricesData?.sedexPrice.replace(',', '.'))
          : Number(deliveriesPricesData?.pacPrice.replace(',', '.')),
      deliveryDays: parseInt(
        data.deliveryType === 'PAC'
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

    setDeliveryData(newDeliveryData)

    //const receivedInsertedValue: IDBResponse = await insertPurchase({ deliveryData: newDeliveryData, cartData: cart })
    savePurchaseDelivery({ data: newDeliveryData, purchaseId }).then((response) => {
      if (response.isError)
        sendAlert({ message: 'Erro ao salvar dados de entrega: ' + response.message, type: 'error' })
    })

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
        const prices = {
          pac: data.data.pacPrice as number,
          sedex: data.data.sedexPrice as number,
          pacDeliveryTime: data.data.pacDeliveryTime as number,
          sedexDeliveryTime: data.data.sedexDeliveryTime as number,
        }
        setDeliveriesPricesData({
          pacPrice: prices.pac.toFixed(2).replace('.', ','),
          pacDeliveryTime: prices.pacDeliveryTime.toString(),
          sedexPrice: prices.sedex.toFixed(2).replace('.', ','),
          sedexDeliveryTime: prices.sedexDeliveryTime.toString(),
        })
      })
      .catch((error) => {
        setGetDeliveryPriceTries(getDeliveryPriceTries + 1)
        if (getDeliveryPriceTries < 3) {
          getDeliveryPrice().then(() => {
            setGetDeliveryPriceTries(0)
          })
        } else {
          console.error(error)
          alert('Erro ao calcular frete: ' + error)
        }
      })
  }

  async function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value
    //
    const cep = formatCEP(value)

    setValue('cep', cep)

    if (cep.length === 9) {
      setValue('state', '') // Reset state since its value controls the SEDEX and PAC visibility.
      setIsLoadingAddress(true)

      getDeliveryPrice()

      const address = await getAddressByCep(formatToNumber(cep))

      if (address.error) {
        sendAlert({
          message: 'CEP não encontrado. Ele está correto?',
          type: 'OK',
        })
      }

      setValue('state', address.uf)
      setValue('address', address.logradouro)
      setValue('neighborhood', address.bairro)
      setFocus('number')
      setValue('city', address.localidade)
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
          {isLoadingAddress ? (
            <Skeleton className="h-12 w-72" />
          ) : (
            <input
              type="text"
              id="address"
              className="w-full rounded-lg border border-gray-300 p-3"
              {...register('address')}
            />
          )}
          {errors.address && <p className="text-destructive">{errors.address.message}</p>}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col items-start  gap-3">
            <label htmlFor="number">Número</label>
            {isLoadingAddress ? (
              <Skeleton className="h-12 w-36" />
            ) : (
              <input
                type="text"
                id="number"
                className="w-32 rounded-lg border border-gray-300 p-3"
                {...register('number')}
              />
            )}
            {errors.number && <p className="text-destructive">{errors.number.message}</p>}
          </div>

          <div className="flex flex-col items-start  gap-3">
            <label htmlFor="complement">Complemento</label>
            {isLoadingAddress ? (
              <Skeleton className="h-12 w-36" />
            ) : (
              <input
                type="text"
                id="complement"
                className="w-full rounded-lg border border-gray-300 p-3"
                {...register('complement')}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col items-start  gap-3">
          <label htmlFor="neighborhood">Bairro</label>
          {isLoadingAddress ? (
            <Skeleton className="h-12 w-72" />
          ) : (
            <input
              type="text"
              id="neighborhood"
              className="w-full rounded-lg border border-gray-300 p-3"
              {...register('neighborhood')}
            />
          )}
          {errors.neighborhood && <p className="text-destructive">{errors.neighborhood.message}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="state">Estado</label>
          {isLoadingAddress ? (
            <Skeleton className="h-12 w-72" />
          ) : (
            <input
              id="state"
              className="w-full border-none outline-none"
              disabled
              {...register('state')}
              placeholder="Digite o cep para preencher"
            />
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="city">Cidade</label>

          {isLoadingAddress ? (
            <Skeleton className="h-12 w-72" />
          ) : (
            <input
              id="city"
              className="border-none outline-none"
              disabled
              {...register('city')}
              placeholder="Digite o cep para preencher"
            />
          )}
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
          <div className="flex flex-col justify-start gap-3">
            <b>Escolha o frete:</b>
            <div className="flex flex-col justify-evenly gap-5">
              {deliveriesPricesData?.pacPrice ? (
                <>
                  <div
                    className={`w-full cursor-pointer rounded-lg   border p-2  text-center ${watch('deliveryType') === 'SEDEX' ? 'border-white bg-yellow-700 text-white' : 'border-yellow-700 text-yellow-700 hover:border-white hover:bg-yellow-600 hover:text-white'}`}
                    onClick={() => setValue('deliveryType', 'SEDEX')}
                  >
                    SEDEX - R$ {deliveriesPricesData?.sedexPrice} ({Number(deliveriesPricesData?.sedexDeliveryTime)}{' '}
                    dia(s))
                  </div>
                  <div
                    className={`w-full cursor-pointer rounded-lg   border p-2  text-center ${watch('deliveryType') === 'PAC' ? 'border-white bg-yellow-700 text-white' : 'border-yellow-700 text-yellow-700 hover:border-white hover:bg-yellow-600 hover:text-white'}`}
                    onClick={() => setValue('deliveryType', 'PAC')}
                  >
                    PAC - R$ {deliveriesPricesData?.pacPrice} ({deliveriesPricesData?.pacDeliveryTime} dias)
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`w-full cursor-pointer rounded-lg   border p-2  text-center ${watch('deliveryType') === 'SEDEX' ? 'border-white bg-yellow-700 text-white' : 'border-yellow-700 text-yellow-700 hover:border-white hover:bg-yellow-600 hover:text-white'}`}
                  >
                    <Skeleton className="h-8 w-full bg-gray-300" />
                  </div>
                  <div
                    className={`w-full cursor-pointer rounded-lg   border p-2  text-center ${watch('deliveryType') === 'PAC' ? 'border-white bg-yellow-700 text-white' : 'border-yellow-700 text-yellow-700 hover:border-white hover:bg-yellow-600 hover:text-white'}`}
                  >
                    <Skeleton className="h-8 w-full bg-gray-300" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {watch('deliveryType') && <TotalsContainer deliveryPrice={watch('deliveryPrice')} />}

        <Button type="button" className="w-full" onClick={goBackToCart}>
          Voltar para os itens
        </Button>
        <Button
          type="submit"
          className="w-full"
          disabled={
            !watch('deliveryType') ||
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
