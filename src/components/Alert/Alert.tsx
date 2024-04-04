'use client'
import { ReactNode, useContext, useMemo } from 'react'
import { AlertDialogContext } from '@/contexts/AlertDialogContext'
import { Button } from '../Button/Button'
import avatar1 from '/public/alertAvatar1.png'
import Image from 'next/image'

export function Alert() {
  const { isAlertOpen, alertData, setIsAlertOpen } = useContext(AlertDialogContext)

  interface IAlertValues {
    title: string
    buttons: ReactNode
  }

  const alertValues: IAlertValues = useMemo(() => {
    switch (alertData.type) {
      case 'OK':
        return {
          title: 'Aviso',
          buttons: (
            <Button className="w-32" onClick={() => setIsAlertOpen(false)}>
              OK
            </Button>
          ),
        }
      case 'YN':
        return {
          title: 'Confirmação',
          buttons: (
            <>
              <Button onClick={alertData.onConfirm}>Sim</Button>
              <Button onClick={alertData.onCancel}>Não</Button>
            </>
          ),
        }
      default:
        return {
          title: '',
          buttons: <></>,
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertData.type])

  return (
    <div>
      <div
        className={`fixed top-0 z-40 size-full bg-black transition-opacity duration-500 ${isAlertOpen ? 'opacity-45' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsAlertOpen(false)}
      ></div>
      <div
        className={`fixed left-1/2 z-50 mx-auto ml-[-250px] mt-[-100px] h-64 w-[500px] min-w-[400px] rounded-lg border-4 border-black bg-white transition-all duration-500 ${isAlertOpen ? 'top-1/2' : 'pointer-events-none top-[400px] opacity-0'}`}
      >
        <Image
          src={avatar1}
          alt=""
          width={200}
          height={100}
          className={`absolute bottom-[193px] right-0 z-50 transition-all ${isAlertOpen ? '' : 'pointer-events-none opacity-0'}`}
        />
        <div className="flex min-h-full flex-1 flex-col justify-between rounded-lg bg-yellow-100">
          <div className="border-b-4 border-black bg-yellow-900 px-5 py-3 text-white">{alertValues.title}</div>
          <div className=" px-7 py-3">{alertData.message}</div>
          <div className="mb-5 mr-5 self-end">{alertValues.buttons}</div>
        </div>
      </div>
    </div>
  )
}
