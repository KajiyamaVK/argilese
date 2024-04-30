import { ItemsContainer } from '@/components/ItemsContainer/ItemsContainer'
import { MainBanner } from '@/components/MainBanner/MainBanner'

export default function Home() {
  const inMaintenance = true
  if (inMaintenance) {
    return <div className="bg-yellow-700 text-center">Em manutenção</div>
  } else {
    return (
      <div>
        <MainBanner />
        <ItemsContainer />
      </div>
    )
  }
}
