"use client";

import Image from 'next/image';
import { useContext } from 'react';
import { AppContext } from '@/Context/appReactiveContext';

//Remove Following Comments... Components Imported

/*import HeroSection from '../../components/HeroSection'
import Socials from '../../components/Socials';
import Catalogue from '../../components/Catalogue';
import Services from '../../components/Services';
import WhyChooseUs from '../../components/WhyChooseUs';
import Testimonials from '../../components/Testimonials';*/

export default function Home() {
  const {dark , setDark , handleThemeChange} = useContext(AppContext);
  
  return (
    <main className="flex h-full w-full">
      <div className='h-full w-full bg-[#1D023C] -z-40 absolute top-0 right-0'/>
      <Image src={'/Assets/bgImg.svg'} width={0} height={0} alt="GrayZone" className={`w-screen h-screen object-cover md:object-cover absolute top-0 left-0 -z-30`}/>

      <div className={`${`bg-white text-black`} flex flex-col justify-center gap-24 items-center h-full w-full `}>
       
      {/* 
      
      <HeroSection/>
      
      <Socials/>

      <Services/>

      <WhyChooseUs/>

      <Catalogue/>

      <Testimonials/>


      */}
      </div>
     
    </main>
  )
}
