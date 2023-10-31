import './globals.css'
//import { Inter } from 'next/font/google'
//import { AppProvider } from '../Context/appReactiveContext'
import React from 'react'
import {DappAppProvider} from '../Context/appBockchainContext'
import Footer from '@/components/Footer'
//const inter = Inter({ subsets: ['latin'] })
import Header from '@/components/header'

export const metadata = {
  title: 'GrayZone Web3 Services',
  description: 'Official Site for GrayZone Web3 Service Agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DappAppProvider>
          
          <Header/>
          <main>
          {children}
          </main>
          <Footer/>
        </DappAppProvider>
        </body>
    </html>
  )
}
