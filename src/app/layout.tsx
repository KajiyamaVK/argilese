import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Topbar } from '@/components/Topbar/Topbar'
import { PurchaseContextProvider } from '@/contexts/PurchaseContext'
import { AlertDialogProvider } from '@/contexts/AlertDialogContext'
import { Alert } from '@/components/Alert/Alert'
import { GeneralProvider } from '@/contexts/GeneralContext'
import whatsappLogo from '/public/logos/whatsapp_logo.png'
import Image from 'next/image'
import Link from 'next/link'

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
        <GeneralProvider>
          <AlertDialogProvider>
            <PurchaseContextProvider>
              <Alert />
              <Topbar />
              {children}
            </PurchaseContextProvider>
          </AlertDialogProvider>
        </GeneralProvider>
        <Link href={'https://wa.me/+5511978852047'} target="_blank">
          <Image src={whatsappLogo} width={100} height={100} alt="" className="fixed bottom-20 right-8 z-50" />
        </Link>
      </body>
    </html>
  )
}
