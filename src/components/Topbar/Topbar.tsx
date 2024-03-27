import Image from 'next/image'
import logo from '/public/topbar_logo.png'
import { baloo } from '@/utils/functions'

export function Topbar() {
  return (
    <div className="flex gap-5 items-center bg-orange-100 p-3">
      <Image
        src={logo}
        className="cover ml-10"
        alt="Logo da Argilese com um sol e um cachorro de orelhas longas, caramelo"
        width={50}
      />
      <h1 className={`text-3xl font-bold ${baloo.className} text-yellow-900`}>Argile-se</h1>
    </div>
  )
}
