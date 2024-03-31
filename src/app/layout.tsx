import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Topbar } from '@/components/Topbar/Topbar'
import { GeneralProvider } from '@/contexts/general'

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
          className="absolute flex flex-wrap justify-center w-full bg-center bg-cover -z-10 top-0 h-full"
          style={{ backgroundImage: 'url(/bannerBG.png)', filter: 'blur(8px)' }}
        />
        <GeneralProvider>
          <Topbar />
          {children}
        </GeneralProvider>
      </body>
    </html>
  )
}
