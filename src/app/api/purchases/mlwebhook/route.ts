export async function POST(req: Request) {
  const { body } = req
  console.log(body)
  return new Response('ok')
}

export async function GET() {
  console.log('saves')

  return new Response('ok')
}
