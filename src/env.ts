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
})

type IEnv = z.infer<typeof envSchema>

let env: IEnv
console.log('teste')
try {
  envSchema.parse(process.env)
} catch (error) {
  console.error(JSON.stringify(error))
}

export { env }
