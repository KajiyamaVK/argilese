import mysql, { PoolOptions, Pool } from 'mysql2/promise'

// Função para criar o pool de conexões
async function createConnection(): Promise<Pool> {
  const access: PoolOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'), // Valor padrão para MySQL
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    // As propriedades abaixo não são suportadas diretamente pelo mysql2 e foram removidas
    // maxIdle, idleTimeout, enableKeepAlive, keepAliveInitialDelay
  }
  try {
    const pool = await mysql.createPool(access)

    return pool
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw new Error('Error connecting to database')
  }
}

// Exportar a função para criar a conexão, em vez do pool diretamente
export const getDatabaseConnection = () => createConnection()
