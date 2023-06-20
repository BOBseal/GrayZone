"use client";

import Image from 'next/image';
import { useState } from 'react';

//Remove Following Comments... Components Imported

/*import HeroSection from '../../components/HeroSection'
import Socials from '../../components/Socials';
import Catalogue from '../../components/Catalogue';
import Services from '../../components/Services';
import WhyChooseUs from '../../components/WhyChooseUs';
import Testimonials from '../../components/Testimonials';*/

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
      
      <div className='bg-black text-white min-h-full min-w-full flex flex-col justify-center gap-24 items-center pt-4'>
        {<button className='text-4xl font-bold font-serif' onClick={()=> handleThemeChange()}>Toggle Theme</button>}

       <p className='font-mono'> Start Content From Here...</p>
      
      {/* 
      
      <HeroSection/>
      
      <Socials/>

      <Services/>

      <WhyChooseUs/>

      <Catalogue/>

      <Testimonials/>


      */}
      </div>
      :

      //Light Mode Here
      <div className=' bg-slate-200 text-black min-h-full min-w-full flex justify-center gap-24 items-center flex-col pt-4'>
        {<button className=' text-4xl font-bold font-serif' onClick={()=> handleThemeChange()}>Toggle Theme</button>}
      

        <p className='font-mono'>Start Content From Here...</p>
      {/* 
      
      <HeroSection/>
      
      <Socials/>

      <Services/>

      <WhyChooseUs/>

      <Catalogue/>

      <Testimonials/>


      */}
      </div>
      }
    </main>
  )
}
