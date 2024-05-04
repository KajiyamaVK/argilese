'use client'
import { baloo } from '@/utils/fontsExports/fonts'
import logo from '/public/logo_lg.png'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '@/contexts/GeneralContext'
import Cookies from 'js-cookie'

export function MainBanner() {
  const { setIsAdmin } = useContext(GeneralContext)
  const [devCounter, setDevCounter] = useState(0)

  useEffect(() => {
    const isAdminCookie = Cookies.get('Argilese.isAdmin')

    if (isAdminCookie) {
      setIsAdmin(true)
      return
    }
    if (devCounter === 10) {
      alert('Erro na página - por favor, recarregue a página')
    }

    if (devCounter === 20) {
      setIsAdmin(true)
      alert('Tome muito cuidado, criança...')

      Cookies.set('Argilese.isAdmin', 'true', {
        path: '/',
        expires: 31,
      })
    }

    setTimeout(() => {
      if (devCounter > 20) setDevCounter(0)
    }, 10000)
  }, [devCounter, setIsAdmin])

  return (
    <div>
      <div className="flex h-full flex-wrap items-center justify-center gap-5">
        <Image
          src={logo}
          className=" z-10 bg-cover"
          width={300}
          alt="Logo da Argile-se"
          priority
          onClick={() => setDevCounter(devCounter + 1)}
        />
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
