"use client"
import Image from 'next/image';
//import { useContext } from 'react';
import { AppContext } from '@/Context/appReactiveContext';

//Remove Following Comments... Components Imported
import HeroSection from '../components/HeroSection'
import Socials from '../components/Socials';
import Catalogue from '../components/Catalogue';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
//Transitions and effects
import {AnimatePresence, motion} from "framer-motion"

export default function Home() {
  //const {dark , setDark , handleThemeChange} = useContext(AppContext);
  
  return (
    <main className="flex min-h-screen max-h-screen min-w-screen bg-[#1D023C] overflow-auto mt-[4.2rem]">
      <Image src={'/Assets/bgImg.svg'} width={0} height={0} alt="GrayZone" className={`w-screen h-screen object-cover md:object-cover absolute top-[2.5rem] left-0`}/>

      <div className={`${`bg-white text-black`} flex flex-col justify-center gap-24 items-center h-full w-full bg-[#1D023C]`}>
        <AnimatePresence>
        <motion.div
          initial ={{opacity:0 , y:-50 }}
         animate={{
          opacity:1,
          y:0
         }}
         transition={{ ease: "easeInOut", duration: 0.8 }}
        > 
           
            <div className='flex flex-col bg-transparent mt-[4.5rem] justify-center w-full h-full items-center'>
              <HeroSection/>

              

              {/* 
        
        <HeroSection/>
        
        <Socials/>

        <Services/>

        <WhyChooseUs/>

        <Catalogue/>

        <Testimonials/>


        */}
            </div> 
          
        </motion.div>
        </AnimatePresence>  
      </div>
     
    </main>
  )
}
