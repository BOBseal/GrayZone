'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className='absolute h-[4.2rem] md:h-[4.5rem] w-full z-10 border-t-[2px] drop-shadow-m bg-gradient-to-bl to-[#b67ef5] from-[#1D023C] from-10% to-85%'>
        
        <div className='h-full w-full items-center pl-[2rem] pr-[2rem] md:pl-[15rem] md:pr-[15rem] flex justify-between gap-1 text-[#FFFFFF] drop-shadow-xl'>
          <Link href={'https://twitter.com/grayzoneweb3'}><Image src={'/Assets/twitter.svg'} className="bg-[#9e59ff] border rounded-lg drop-shadow-xl" width={40} height={40}/></Link>
          <Link href={'https://t.me/grayzoneweb3'}><Image src={'/Assets/telegram.svg'} className="bg-[#9e59ff] border rounded-lg drop-shadow-xl" width={40} height={40}/></Link>
          <Link href={'https://mail.google.com/mail/u/0/#inbox?compose=DmwnWrRvwLvPLBHHfvdlBlWMMKtQJCBSVKQBwGJHlbCskmtvZZknScBxqSZrBszhbpHNfvspwmNG'}><Image src={'/Assets/mail.svg'} className="bg-[#9e59ff] border drop-shadow-xl rounded-lg" width={40} height={40}/></Link>
          <Link href={'https://www.linkedin.com/company/grayzoneweb3/'}><Image src={'/Assets/linkedin.svg'} className="bg-[#9e59ff] border rounded-lg drop-shadow-xl" width={40} height={40}/></Link>
        </div>
    </div>       
  )
}

export default Footer