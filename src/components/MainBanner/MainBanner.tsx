import { baloo } from '@/utils/functions'
import logo from '/public/logo_lg.png'
import Image from 'next/image'
import bullet1 from '/public/bullet1.png'
import bullet2 from '/public/bullet2.png'
import bullet3 from '/public/bullet3.png'
import bullet4 from '/public/bullet4.png'

export function MainBanner() {
  return (
    <div>
      <div className="flex flex-wrap items-center h-full justify-center gap-5">
        <Image src={logo} className=" cover z-1" width={300} alt="Logo da Argile-se" />
        <div className="px-5 md:px-0">
          <h2 className={`${baloo.className} font-extrabold text-[3rem] md:text-[4rem] min-w-[400px]`}>
            Da argila à arte
          </h2>
          <p className="mt-3 px-2 md:px-0">Peças artesanais de cerâmica de alta temperatura</p>
          <div className="flex justify-between mt-5 p-3 md:p-0">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Image src={bullet1} width={40} alt="Bullet 1" />
                <p>Peças exclusivas</p>
              </div>
              <div className="flex items-center gap-2">
                <Image src={bullet2} width={40} alt="Bullet 2" />
                <p>Artes de Alta temperatura</p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Image src={bullet3} width={40} alt="Bullet 3" />
                <p>Feitas à mão</p>
              </div>
              <div className="flex items-center gap-2">
                <Image src={bullet4} width={40} alt="Bullet 4" />
                <p>Peças únicas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
