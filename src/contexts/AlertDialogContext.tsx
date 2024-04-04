'use client'
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react'
type TSendAlert = 'OK' | 'YN'

interface ISendAlert {
  type: TSendAlert
  message: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface IAlertDialogContext {
  isAlertOpen: boolean
  sendAlert: ({ message, type, onConfirm, onCancel }: ISendAlert) => void
  setIsAlertOpen: Dispatch<SetStateAction<boolean>>
  alertData: ISendAlert
}

export const AlertDialogContext = createContext<IAlertDialogContext>({} as IAlertDialogContext)

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertData, setAlertData] = useState({} as ISendAlert)

  function sendAlert({ message, type, onConfirm, onCancel }: ISendAlert) {
    setIsAlertOpen(true)
    setAlertData({ message, type, onConfirm, onCancel })
  }

  return (
    <AlertDialogContext.Provider value={{ isAlertOpen, sendAlert, setIsAlertOpen, alertData }}>
      {children}
    </AlertDialogContext.Provider>
  )
}
