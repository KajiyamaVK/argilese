import { z } from 'zod'

const envSchema = z.object({
  DB_NAME: z.string({
    required_error: 'Database name is required',
  }),
  DB_HOST: z.string({
    required_error: 'Database host is required',
  }),
  DB_PORT: z.string({
    required_error: 'Database port is required',
  }),
  DB_USER: z.string({
    required_error: 'Database user is required',
  }),
  DB_PASSWORD: z.string({
    required_error: 'Database password is required',
  }),
  API_URL: z.string({
    required_error: 'API URL is required',
  }),
  TOKEN_FRETES: z.string({
    required_error: 'Token Frete is required',
  }),
  TOKEN_CEPCERTO: z.string({
    required_error: 'Token CepCerto is required',
  }),
  FRETE_SERVICE: z.string({
    required_error: 'Frete service is required',
  }),
  NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY: z.string({
    required_error: 'Mercado Pago public key is required',
  }),
  MERCADO_PAGO_TOKEN: z.string({
    required_error: 'Mercado Pago access token is required',
  }),
})

type IEnv = z.infer<typeof envSchema>

let env: IEnv

try {
  envSchema.parse(process.env)
} catch (error) {
  console.error(JSON.stringify(error))
}

export { env }
