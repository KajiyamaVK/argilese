'use client'
import { Dispatch, SetStateAction, createContext, useState } from 'react'

interface IGeneralContext {
  isAdmin: boolean
  setIsAdmin: Dispatch<SetStateAction<boolean>>
}

export const GeneralContext = createContext<IGeneralContext>({} as IGeneralContext)

interface IGeneralProvider {
  children: React.ReactNode
}

export function GeneralProvider({ children }: IGeneralProvider) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  return <GeneralContext.Provider value={{ isAdmin, setIsAdmin }}>{children}</GeneralContext.Provider>
}
