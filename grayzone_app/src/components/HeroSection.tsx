"use client"
import React from 'react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className={`flex h-full items-center max-w-screen w-screen justify-between flex-col z-0 -mt-6 `}>
      
      <div className='flex justify-between lg:justify-center flex-col md:flex-row lg:flex-col gap-[20px] h-full w-full p-8 md:p-24 items-center '>
        
        <div className='flex justify-center bg-[#9041ff] border-[2px] shadow-lg items-center w-full md:w-7/12 lg:w-[600px] bg-opacity-40 rounded-2xl lg:-mt-[1px] p-6 lg:pt-[3rem] lg:pb-[3rem]'>
            <Image src={'/Assets/logo.svg'} width={300} height={200} alt="GRAYZONE WEB3" className='flex object-contain h-[250px] w-[300px] md:w-[500px] lg:w-[1200px] drop-shadow-2xl'/>
          </div>
          
          <div className='flex flex-col justify-evenly w-full md:w-5/12 gap-4 rounded-3xl pb-1 lg:w-[600px] bg-opacity-40 object-contain md:pr-2 md:pl-2'>
            <div className='flex font-bold text-[2rem] justify-center md:text-[2.5rem] lg:text-[5.5rem] w-full flex-wrap gap-[5px] md:gap[10px]'>
              
              <p className=' text-slate-300 drop-shadow-2xl underline underline-offset-[4px]'>GrayZone</p>
              <div className='flex text-[#3decffec] underline underline-offset-[4px]'>
                <p className='text-[#ff2f2f] drop-shadow-2xl'>W</p>
                <p className=' text-yellow-300 drop-shadow-2xl'>e</p>
                <p className=' text-emerald-400 drop-shadow-2xl'>b</p>
                <p className='text-[#3decffec]'>3</p>
              </div>

            </div>
            <p className='flex text-[1.1rem] flex-wrap font-medium text-slate-100 md:pr-[1.5rem] md:pl-[1.5rem]'>
              At GrayZone Web3, we blend innovation, creativity, and 
              expertise to reshape the digital landscape. From Web3 
              development that embraces the future to captivating graphics
              and tailored web solutions, we're your partners in digital 
              transformation. Join us on the journey to redefine possibilities 
              in the digital world.
              </p> 
          </div>

    
        </div>

        <div className='w-full h-[150px] flex flex-col justify-between items-center'>
            <p className='flex text-[2rem] font-bold animate-slowerFlicker hover:animate-wiggleSlow md:animate-slowerPing text-slate-100'>COMING SOON</p>
        </div>    
    </div>
  )
}

export default HeroSection