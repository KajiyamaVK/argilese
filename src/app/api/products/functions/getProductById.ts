import { Conn } from '@/utils/database'
import { NextResponse } from 'next/server'

export async function getProductById(id: number) {
  try {
    // Usando parâmetros na query para prevenir injeção de SQL.
    const [results] = (await Conn.query(
      `
      SELECT
        id,
        productName,
        productDescription,
        price,
        productImages,
        height,
        width,
        weight,
        length,
        diameter,
        hasHandle
      FROM products
      WHERE id = ?`,
      [id],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any

    // Supondo que id é único, deve haver apenas um produto ou nenhum.
    if (results.length === 0) {
      //return new Response(JSON.stringify({ message: 'Error fetching products' }), { status: 500 })
      return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
    }

    // Como id é único, podemos pegar o primeiro resultado diretamente.

    return new Response(JSON.stringify(results[0]), { status: 200 })
  } catch (error) {
    console.error(`Error fetching product by id: ${error}`)
    //return new Response(JSON.stringify({ message: 'Error fetching product' }), { status: 500 })
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}
