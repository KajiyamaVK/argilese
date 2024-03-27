export default function ItemPage({ params }: { params: { itemId: number } }) {
  const { itemId } = params
  console.log(params, itemId) // Add this line
  return (
    <div>
      <h1>ItemPage {itemId}</h1>
    </div>
  )
}
