// database.ts
import mysql, { PoolOptions } from 'mysql2/promise'

const access: PoolOptions = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || ''),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const Conn = mysql.createPool(access)

if (!Conn) {
  console.error('Error connecting to database')
}

export { Conn }
