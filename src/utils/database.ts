// // database.ts
import mysql, { PoolOptions } from 'mysql2/promise'

let Conn: mysql.Pool
try {
  const access: PoolOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || ''),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
  }
  Conn = mysql.createPool(access)
} catch (error) {
  console.error('Error connecting to database')
}

export { Conn }
