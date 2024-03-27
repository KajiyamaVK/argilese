export default function ItemPage({ params }: { params: { itemId: number } }) {
  const { itemId } = params

  return (
    <div>
      <h1>ItemPage {itemId}</h1>
    </div>
  )
}
