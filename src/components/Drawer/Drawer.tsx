import { PurchaseContext } from '@/contexts/PurchaseContext'
import { Dispatch, ReactNode, SetStateAction, useContext } from 'react'
import { RxCaretRight } from 'react-icons/rx'

interface IDrawerRoot {
  isOpen: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  children: ReactNode
}

function DrawerRoot({ isOpen, onOpenChange, children }: IDrawerRoot) {
  const { currentStep } = useContext(PurchaseContext)
  return (
    <>
      <div
        className={`fixed right-0 top-0 z-30 h-full min-w-[400px] max-w-[400px] rounded-l-lg bg-white shadow shadow-black transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col gap-5">
          {currentStep !== 'paymentStatus' && (
            <button
              className="ml-5 mt-5 flex items-center gap-2"
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Fechar <RxCaretRight />
            </button>
          )}
          <div className="mt-10">{children}</div>
        </div>
      </div>
      <div
        className={`fixed top-0 z-20 size-full bg-black transition-opacity duration-500 ${isOpen ? 'opacity-45' : 'pointer-events-none opacity-0'}`}
        onClick={() => onOpenChange(false)}
      ></div>
    </>
  )
}

export const Drawer = {
  Root: DrawerRoot,
}
