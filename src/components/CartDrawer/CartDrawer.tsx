'use client'

import { GeneralContext } from '@/contexts/general'
import { Drawer } from 'vaul'
import { Dispatch, SetStateAction, useContext } from 'react'
import Image from 'next/image'
import { Button } from '../Button/Button'
import { RxCaretRight } from 'react-icons/rx'

interface ICartDrawer {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function CartDrawer({ isOpen, setIsOpen }: ICartDrawer) {
  const { cart, removeFromCart } = useContext(GeneralContext)
  return (
    <Drawer.Root direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
          <Drawer.Close>
            <button className="flex gap-2 items-center mt-5 ml-5">
              Fechar <RxCaretRight />
            </button>
          </Drawer.Close>
          <div className="p-4 bg-white flex-1 h-full">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium mb-4">Carrinho</Drawer.Title>
              <div className="flex flex-col gap-4">
                {cart.map((product) => (
                  <div key={product.id} className="flex border-b-2 border-gray-100 py-10">
                    <Image
                      src={product.productImages.split(';')[0]}
                      alt={product.productName}
                      width={70}
                      height={70}
                      className="rounded-full border-2 border-gray-200 shadow-lg shadow-gray-500"
                    />
                    <div className=" ml-10 flex flex-col justify-between">
                      <p>{product.productName}</p>
                      <div className="flex gap-2 items-end justify-end">
                        <p className="font-bold">R$ </p>
                        <p className="font-bold ">{product.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <button
                        className="text-destructive self-end"
                        onClick={() => {
                          removeFromCart(product.id)
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
                <table className="ml-28">
                  <tr>
                    <td className="font-bold w-fit">Quantidade de itens: </td>
                    <td className="flex-1">{cart.length}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Total: </td>
                    <td>
                      R${' '}
                      {cart
                        .reduce((acc, product) => acc + product.price, 0)
                        .toFixed(2)
                        .replace('.', ',')}
                    </td>
                  </tr>
                </table>
              </div>
              <Button className="mt-10 bg-yellow-700 float-right">Finalizar compra</Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
