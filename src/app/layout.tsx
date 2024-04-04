import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Topbar } from '@/components/Topbar/Topbar'
import { CartContextProvider } from '@/contexts/CartContext'
import { AlertDialogProvider } from '@/contexts/AlertDialogContext'
import { Alert } from '@/components/Alert/Alert'

const roboto = Roboto({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Argile-se',
  description: 'Venda de artes de olaria',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.className}`}>
        <div
          className="absolute top-0 -z-10 flex size-full flex-wrap justify-center bg-cover bg-center"
          style={{ backgroundImage: 'url(/bannerBG.png)', filter: 'blur(8px)' }}
        />
        <AlertDialogProvider>
          <CartContextProvider>
            <Alert />
            <Topbar />
            {children}
          </CartContextProvider>
        </AlertDialogProvider>
      </body>
    </html>
  )
}
