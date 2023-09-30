"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import MenU  from '../../public/Assets/icons8-hamburger-menu-128.svg'
import Link from 'next/link'
const Header = () => {
    const [x, setX ] = useState(false); // menu opener
  return (
    <div className='sticky -top-1 h-[4.2rem] md:h-[4.5rem] w-full z-50 border-b-[2px] drop-shadow-m bg-gradient-to-br to-[#b67ef5] from-[#1D023C] from-10% to-85%'>
        
        <div className='h-full w-full flex justify-between gap-1 text-[#FFFFFF]'>
            
            <div className='left flex gap-2 w-5/12 justify-start pl-[1.2rem] md:pl-[3.3rem] items-center mt-2 cursor-pointer group'>
                
            <Link href={'./'}><Image src={'/Assets/logo.svg'} height={40} width={40} alt="GrayZone Logo" className='drop-shadow-xl'/></Link>
                <AnimatePresence>
                <motion.div
                    initial ={{opacity:0 , x:-20}}
                    animate={{
                    opacity:1,
                    x:0
                    }}
                    transition={{ ease: "easeOut", duration: 0.8 }}
                    > 
                       <Link href={'./'}>
                         <div className='flex gap-1 text-xl font-extrabold font-serif'>
                            <h1 className='text-slate-300 drop-shadow-xl'>GrayZone</h1>
                            
                            <motion.div
                            initial ={{opacity:0 , x:-30}}
                            animate={{
                            opacity:1,
                            x:0
                            }}
                            transition={{ ease: "easeOut", duration:0.5 }}
                            >
                            <div className=' drop-shadow-xl flex'>
                                <p className='text-[#ff2f2f] group-hover:animate-wiggleBounce3 '>W</p>
                                <p className=' text-yellow-300 group-hover:animate-wiggleBounce3'>e</p>
                                <p className=' text-emerald-400 group-hover:animate-wiggleBounce2'>b</p>
                                <p className='text-[#3decffec] group-hover:animate-wiggleBounce'>3</p>
                            </div>
                            </motion.div>
                        </div>
                        </Link>
                </motion.div>
                </AnimatePresence>

            </div>
            
            <div className='right flex justify-end md:pr-[2.5rem] lg:pr-[2.9rem] items-center w-7/12'>
                <AnimatePresence>
                <motion.div
                    initial ={{opacity:0 , x:-200}}
                    animate={{
                    opacity:1,
                    x:0
                    }}
                    transition={{ ease: "easeOut", duration: 0.75 }}
                >
                    {/*MOBILE Menu */
                    
                    <div className='hidden md:hidden lg:hidden mt-2 pr-[0.9rem]'>
                        <Image src={MenU} width={37} height={37} alt="Menu" className='border bg-gradient-to-b from-[5%] from-[#6b13d1] to-[#b67ef5] rounded-full' />
                    </div>
                    
                    }

                    {/*DESKTOP MENU*/}
                    <div className={`hidden md:flex justify-between gap-4 mt-2 w-11/12 font-semibold text-[1.1rem]`}>
                        
                        <div className={`w-[8rem] flex justify-center hover:underline items-center drop-shadow-lg hover:text-[1.2rem]`}>
                            <Link href={'./'}>
                                <button onClick={()=> window.location.reload()}>
                                    Home
                                </button>
                            </Link>
                        </div>

                        <div className='w-[8.3rem] flex justify-center items-center hover:underline drop-shadow-lg hover:text-[1.2rem]'>
                            <button onClick={()=> alert("Mint ZONEPASS Alpha Edition to Access Services")} className='flex gap-[5px] items-center justify-center'>
                               
                               <p>Our Products</p>
                               
                               <Image src={'/Assets/down-arrow-backup-2-svgrepo-com.svg'} width={12} height={20} alt="arrow" className='flex justify-center mt-[4px] hidden'/>
                            </button>
                        </div>

                        <div className='w-[8rem] flex justify-center items-center bg-slate-400 rounded-3xl drop-shadow-lg h-[2rem] hover:text-[1.2rem] hover:h-[2.1rem]'>
                            <Link href={"https://t.me/grayzoneweb3"}>
                                <button onClick={()=> setX(true)} className="drop-shadow-lg">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
                </AnimatePresence>
            </div>

        </div>
        
    </div>
  )
}

export default Header