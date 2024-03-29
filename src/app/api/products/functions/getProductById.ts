//import { Conn } from '@/utils/database'
//import { RowDataPacket } from 'mysql2' // Ou o pacote de tipos correspondente, dependendo do que você está usando.
import mysql, { PoolOptions } from 'mysql2/promise'
import { NextResponse } from 'next/server'

export async function getProductById(id: number) {
  // eslint-disable-next-line
  
  try {
    // eslint-disable-next-line
    const access = {
      host: 'roundhouse.proxy.rlwy.net',
      //host: process.env.DB_HOST,
      port: 26488,
      //port: parseInt(process.env.DB_PORT || ''),
      user: 'root',
      //user: process.env.DB_USER,
      password: 'CjoIjAtikApIKmYemriKtNCOYJWIIQBS',
      database: 'railway',
      waitForConnections: true,
      maxIdle: 10,
      idleTimeout: 60000,
      connectionLimit: 10,
      queueLimit: 0,
    }
    // eslint-disable-next-line
   const conn = mysql.createPool(access)
  } catch (error) {
    console.error('Error connecting to database')
  }
  // try {
  //   // Usando parâmetros na query para prevenir injeção de SQL.
  //   const [results] = (await Conn.query(
  //     `
  //     SELECT
  //       id,
  //       productName,
  //       productDescription,
  //       price,
  //       productImages
  //     FROM products
  //     WHERE id = ?`,
  //     [id],
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   )) as [RowDataPacket[], any]

  //   // Supondo que id é único, deve haver apenas um produto ou nenhum.
  //   if (results.length === 0) {
  //     //return new Response(JSON.stringify({ message: 'Error fetching products' }), { status: 500 })
  //     return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  //   }

  //   // Como id é único, podemos pegar o primeiro resultado diretamente.

  //   return new Response(JSON.stringify(results[0]), { status: 200 })
  // } catch (error) {
  //   console.error(`Error fetching product by id: ${error}`)
  //   //return new Response(JSON.stringify({ message: 'Error fetching product' }), { status: 500 })
  //   return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  // }

  return NextResponse.json({ error: 'Error fetching products' + id }, { status: 200 })
}
