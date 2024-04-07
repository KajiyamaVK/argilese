import { baloo } from '@/utils/maskFunctions'
import logo from '/public/logo_lg.png'
import Image from 'next/image'

export function MainBanner() {
  return (
    <div>
      <div className="flex h-full flex-wrap items-center justify-center gap-5">
        <Image src={logo} className=" z-10 bg-cover" width={300} alt="Logo da Argile-se" />
        <div className="px-5 md:px-0">
          <h2 className={`${baloo.className} min-w-[400px] text-[3rem] font-extrabold md:text-[4rem]`}>
            Da argila à arte
          </h2>
          <p className="mt-3 px-2 md:px-0">Peças artesanais de cerâmica de alta temperatura</p>
        </div>
      </div>
    </div>
  )
}
