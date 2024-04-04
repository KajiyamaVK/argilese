'use client'
import { useRouter } from 'next/navigation'
import { RxCaretLeft } from 'react-icons/rx'

export default function BackButton() {
  const router = useRouter()

  return (
    <button onClick={() => router.back()} className="flex h-10 items-center gap-2 text-xl">
      <RxCaretLeft size={24} />
      Voltar
    </button>
  )
}
