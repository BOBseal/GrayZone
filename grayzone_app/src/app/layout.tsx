import './globals.css'
//import { Inter } from 'next/font/google'
//import { AppProvider } from '../Context/appReactiveContext'
import React from 'react'
import {DappAppProvider} from '../Context/appBockchainContext'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
//const inter = Inter({ subsets: ['latin'] })
import Header from '@/components/header.jsx'

export const metadata = {
  title: 'GrayZone Web3 Services',
  description: 'GRAYZONE WEB3 : Grayzone Web3 is a Blockchain Based Development Service Provider cum Tooling Service. Powered by Zonepass as a one source to web3 for users, as well as B2B services for Businesses',
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
        <Analytics/>
        </body>
    </html>
  )
}
