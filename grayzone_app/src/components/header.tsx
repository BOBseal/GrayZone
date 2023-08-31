import React from 'react'
import Image from 'next/image'

const Header = () => {
  return (
    <div className='absolute -top-1 h-[3.8rem] md:h-[4.5rem] w-full z-50 border-b-[2px] rounded-xl drop-shadow-m bg-gradient-to-br to-[#b67ef5] from-[#1D023C] from-10% to-85%'>
        
        <div className='h-full w-full flex justify-between gap-1 text-[#FFFFFF]'>

            <div className='left flex gap-2 w-5/12 justify-start pl-[3.3rem] items-center mt-2'>
                
                <Image src={'/Assets/logo.svg'} height={40} width={40} alt="GrayZone Logo"/>
                
                <div className='flex gap-1 text-xl font-bold'>
                    <h1 className='text-slate-300'>GrayZone</h1>
                    <h2 className='text-[#3decffec]'>Web3</h2>
                </div>

            </div>

            <div className='right flex justify-end pr-4 items-center w-7/12'>
                <div>

                </div>
            </div>

        </div>
        
    </div>
  )
}

export default Header