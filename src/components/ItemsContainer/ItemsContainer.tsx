import { ItemCard } from '@/components/ItemCard/ItemCard'

export function ItemsContainer() {
  return (
    <div className=" mt-10">
      <h2 className="ml-10 border w-fit border-b-gray-400 border-r-0 border-l-0 border-t-0 mb-10">
        Nossos projetos{'   '}
      </h2>
      <div className="p-10 flex flex-wrap justify-center md:justify-start">
        <ItemCard />
      </div>
    </div>
  )
}
