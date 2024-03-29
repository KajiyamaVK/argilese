// /* eslint-disable */
// import { Conn } from '@/utils/database'

// import { RowDataPacket } from 'mysql2' // Importando o tipo correto para a resposta de uma query SELECT.
// import { NextResponse } from 'next/server'

// export async function getProductsAvailable() {
//   console.log('getProductsAvailable')
//   try {
//     // Usando asserção de tipos para informar ao TypeScript o formato esperado da resposta.
//     // eslint-disable-
//     const [results] = (await Conn.query(`
//     SELECT
//     id,
//     productName,
//     productDescription,
//     price,
//     productImages
//     FROM products
//       WHERE isActive = true`
//       )) as [RowDataPacket[], any]

//       console.log('results', results)
//     if (results.length === 0) {
//       // Checando se existem resultados.
//       return NextResponse.json({ error: 'Não há produtos disponíveis no momento.' }, { status: 400 })
//       //return new Response(JSON.stringify({ message: 'Error fetching products' }), { status: 500 })
//     }

//     return new Response(JSON.stringify(results), { status: 200 })
//   } catch (error) {
//     console.error(`Error fetching products: ${error}`)
//     return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
//   }
// }
