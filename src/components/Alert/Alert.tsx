'use client'
import { ReactNode, useContext, useMemo } from 'react'
import { AlertDialogContext, ISendAlert } from '@/contexts/AlertDialogContext'
import { Button } from '../Button/Button'
import avatar1 from '/public/totoro_totorinho.png'
import noface from '/public/noface.png'
import Image from 'next/image'

export function Alert() {
  const { isAlertOpen, alertData, setIsAlertOpen, setAlertData } = useContext(AlertDialogContext)

  interface IAlertValues {
    title: string
    buttons: ReactNode
  }

  const isError = useMemo(() => alertData.type === 'error', [alertData.type])

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
      case 'error':
        return {
          title: 'Hm... acho que não.',
          buttons: (
            <Button className="w-32 bg-gray-700" onClick={() => setIsAlertOpen(false)}>
              OK
            </Button>
          ),
        }
      case 'YN':
        return {
          title: 'Confirmação',
          buttons: (
            <div className="flex gap-5">
              <Button
                onClick={() => {
                  if (alertData.onConfirm) alertData.onConfirm()
                  setAlertData({} as ISendAlert)
                }}
                className="w-20"
              >
                Sim
              </Button>
              <Button onClick={alertData.onCancel} className="w-20">
                Não
              </Button>
            </div>
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
        className={`fixed left-1/2 z-50 mx-auto ml-[-150px] mt-[-100px] h-64 w-[300px] min-w-[300px] rounded-lg border-4 border-black ${isError ? 'bg-slate-900' : 'bg-yellow-100'} transition-all duration-500 md:ml-[-250px] md:w-[500px] ${isAlertOpen ? 'top-1/2' : 'pointer-events-none top-[400px] opacity-0'}`}
      >
        <Image
          src={isError ? noface : avatar1}
          alt=""
          width={200}
          height={100}
          className={`absolute ${isError ? 'right-[400px] top-[10px]' : 'bottom-[199px] right-0'} z-50 transition-all ${isAlertOpen ? '' : 'pointer-events-none opacity-0'}`}
        />
        <div
          className={`flex min-h-full flex-1 flex-col justify-between rounded-lg ${isError ? 'bg-slate-900' : 'bg-yellow-100'}`}
        >
          <div
            className={`border-b-4 border-black ${isError ? 'bg-black' : 'bg-yellow-900'} px-5 py-3 font-bold text-white`}
          >
            {alertValues.title}
          </div>
          <div className={`${isError && 'text-white'} px-7 py-3 `}>{alertData.message}</div>
          <div className="mb-5 mr-5 self-end">{alertValues.buttons}</div>
        </div>
      </div>
    </div>
  )
}
