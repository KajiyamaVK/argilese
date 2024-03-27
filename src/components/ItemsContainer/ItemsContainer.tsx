import { ItemCard } from '@/components/ItemCard/ItemCard'

export function ItemsContainer() {
  return (
    <div className="ml-10 mt-10">
      <h2 className="border w-fit border-b-gray-400 border-r-0 border-l-0 border-t-0 mb-10">Nossos projetos{'   '}</h2>
      <div className="p-10">
        <ItemCard />
      </div>
    </div>
  )
}
