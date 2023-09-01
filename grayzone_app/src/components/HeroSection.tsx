"use client"
import React from 'react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className={`flex z-10 h-[500px] bg-inherit items-center max-w-screen w-screen justify-between flex-col`}>
      <div className='flex justify-between gap-[20px] h-[350px] w-full p-8 md:p-24'>
        <div className='flex flex-col justify-evenly w-5/12 gap-4'>
          <div className='flex font-bold text-[1.5rem]'>
          <p className=''>GRAYZONE WEB3</p>
          </div>

          <div className='flex text-[0.7rem]'>
           WE ARE A WEB3 SOLUTIONS PROVIDER FOR BUSINESSES AND INDIVIDUALS
          </div> 
        </div>

        <div className='flex justify-center items-center w-7/12 bg-opacity-40 rounded-2xl drop-shadow-2xl'>
          <Image src={'/Assets/logo.svg'} width={300} height={200} alt="GRAYZONE WEB3"/>
        </div>
      
      </div>

      <div className='w-full h-[150px]'>
        OTHER THINGS
      </div>
    </div>
  )
}

export default HeroSection