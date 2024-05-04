'use client'
import Image from 'next/image'
import logo from '/public/topbar_logo.png'
import { baloo } from '@/utils/fontsExports/fonts'
import Link from 'next/link'
import { IoMdCart } from 'react-icons/io'
import { useContext, useState } from 'react'
import { PurchaseContext } from '@/contexts/PurchaseContext'
import { CartDrawer } from '../CartDrawer/CartDrawer'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
//import { AfterPurchaseEmailHTML } from '@/utils/emailFunctions/AfterPurchaseEmail'

export function Topbar() {
  const { cart } = useContext(PurchaseContext)
  const { sendAlert } = useContext(AlertDialogContext)
  const [isCartOpen, setIsCartOpen] = useState(false)

  function openCart() {
    if (cart.length === 0) {
      sendAlert({
        message: 'Ei! Seu carrinho está vazio. O que você quer ver aí?!',
        type: 'error',
      })
      return
    }
    setIsCartOpen(true)
  }

  return (
    <header>
      <div className=" flex items-center justify-between bg-orange-100 p-3 ">
        <Link href="/" className="flex cursor-pointer items-center gap-5">
          <Image
            src={logo}
            className="ml-10"
            alt="Logo da Argilese com um sol e um cachorro de orelhas longas, caramelo"
            width={50}
          />
          <h1 className={`text-3xl font-bold ${baloo.className} text-yellow-900`}>Argile-se</h1>
        </Link>
        <div className="relative mr-10 cursor-pointer" onClick={openCart}>
          <IoMdCart size={32} className="text-yellow-900" />
          {cart.length > 0 && (
            <div className="absolute bottom-0 size-4 rounded-full bg-destructive">
              <p className="flex items-center justify-center text-sm text-white">{cart.length}</p>
            </div>
          )}
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </header>
  )
}
