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
import MINTPASS from '@/components/mintPass';

export default function Home() {
  //const {dark , setDark , handleThemeChange} = useContext(AppContext);
  
  return (
    <main className="flex h-full min-w-screen bg-[#1D023C] relative flex-wrap -mt-[3.8rem] pb-[2rem]">
      
      <Image src={'/Assets/bgImg.svg'} width={0} height={0} alt="GrayZone" className={`h-full w-screen object-cover md:object-cover absolute top-0 left-0`}/>

      <div className={`${`bg-white text-black`} flex flex-col justify-center gap-0 items-center h-full w-full bg-[#1D023C]`}> 
           
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
      </div>
     
    </main>
  )
}
