import { ItemsContainer } from '@/components/ItemsContainer/ItemsContainer'
import { MainBanner } from '@/components/MainBanner/MainBanner'

export default function Home() {
  const inMaintenance = true
  console.log('inMaintenance', inMaintenance, typeof inMaintenance)

  if (inMaintenance) {
    return <div className="text-center">Em manutenção</div>
  } else {
    return (
      <div>
        <MainBanner />
        <ItemsContainer />
      </div>
    )
  }
}
