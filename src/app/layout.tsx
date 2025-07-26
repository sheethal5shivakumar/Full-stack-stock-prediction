import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import { MainContent } from '@/components/MainContent'
import { Footer } from '@/components/Footer'
import { SidebarProvider } from '@/context/SidebarContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI-Powered Crypto Research',
  description: 'Advanced cryptocurrency market analysis and predictions powered by neural networks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <Providers>
          <SidebarProvider>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
              <NavBar />
              <div className="flex flex-1 relative">
                <Sidebar />
                <MainContent>{children}</MainContent>
              </div>
              <Footer />
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
