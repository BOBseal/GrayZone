"use client";

import Image from 'next/image'
import { useState } from 'react'


export default function Home() {
  
  const [dark, setDark] = useState(false)
  
  const handleThemeChange=async()=>{
    try {
      if(!dark) {
        setDark(true);
      }
      if(dark){
        setDark(false);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
  return (
    <main className="flex min-h-screen min-w-screen ">
      {dark?
      
      //DARK MODE HERE
      
      <div className='bg-black text-white min-h-full min-w-full flex flex-col justify-between pt-4'>
        {/*<button onClick={()=> handleThemeChange()}>Toggle Theme</button>*/}
      
      {/* 
      
      <HeroSection/>
      
      <OurLinks/>

      <OurServices/>

      <WhyChooseUs/>

      <ProjectCatalogue/>

      <Testimonials/>


      */}
      </div>
      :

      //Light Mode Here
      <div className=' bg-slate-200 text-black min-h-full min-w-full flex justify-between flex-col pt-4'>
        {/*<button onClick={()=> handleThemeChange()}>Toggle Theme</button>*/}
      
      {/* 
      
      <HeroSection/>
      
      <OurLinks/>

      <OurServices/>

      <WhyChooseUs/>

      <ProjectCatalogue/>

      <Testimonials/>


      */}
      </div>
      }
    </main>
  )
}
