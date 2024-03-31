'use client'

import Image from 'next/image'
import logo from '/public/topbar_logo.png'
import { baloo } from '@/utils/functions'
import Link from 'next/link'
import { IoMdCart } from 'react-icons/io'
import { useContext, useState } from 'react'
import { GeneralContext } from '@/contexts/general'
import { CartDrawer } from '../CartDrawer/CartDrawer'

export function Topbar() {
  const { cart } = useContext(GeneralContext)
  const [isCartOpen, setIsCartOpen] = useState(false)

  function openCart() {
    if (cart.length === 0) return alert('Seu carrinho está vazio.')
    setIsCartOpen(true)
  }

  return (
    <div>
      <div className=" bg-orange-100 p-3 flex justify-between items-center ">
        <Link href="/" className="cursor-pointer flex gap-5 items-center">
          <Image
            src={logo}
            className="cover ml-10 "
            alt="Logo da Argilese com um sol e um cachorro de orelhas longas, caramelo"
            width={50}
          />
          <h1 className={`text-3xl font-bold ${baloo.className} text-yellow-900`}>Argile-se</h1>
        </Link>
        <div className="relative cursor-pointer mr-10" onClick={openCart}>
          <IoMdCart size={32} className="text-yellow-900" />
          {cart.length > 0 && (
            <div className="absolute bottom-0 h-4 w-4 bg-destructive rounded-full">
              <p className="text-white text-sm flex justify-center items-center">{cart.length}</p>
            </div>
          )}
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </div>
  )
}
