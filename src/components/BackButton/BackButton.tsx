'use client'
import { useRouter } from 'next/navigation'
import { RxCaretLeft } from 'react-icons/rx'

export default function BackButton() {
  const router = useRouter()

  return (
    <button onClick={() => router.back()} className="flex gap-2 text-xl items-center h-10">
      <RxCaretLeft size={24} />
      Voltar
    </button>
  )
}
