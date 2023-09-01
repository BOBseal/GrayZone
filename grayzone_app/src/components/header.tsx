"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import MenU  from '../../public/Assets/icons8-hamburger-menu-128.svg'
const Header = () => {
    const [x, setX ] = useState(false); // menu opener
  return (
    <div className='absolute -top-1 h-[4.2rem] md:h-[4.5rem] w-full z-50 border-b-[2px] drop-shadow-m bg-gradient-to-br to-[#b67ef5] from-[#1D023C] from-10% to-85%'>
        
        <div className='h-full w-full flex justify-between gap-1 text-[#FFFFFF]'>

            <div className='left flex gap-2 w-5/12 justify-start pl-[1.2rem] md:pl-[3.3rem] items-center mt-2 cursor-pointer'>
                
                <Image src={'/Assets/logo.svg'} height={40} width={40} alt="GrayZone Logo" className='drop-shadow-xl'/>
                
                <motion.div
                    initial ={{opacity:0 , x:-20}}
                    animate={{
                    opacity:1,
                    x:0
                    }}
                    transition={{ ease: "easeOut", duration: 0.8 }}
                    > 
                        <div className='flex gap-1 text-xl font-bold'>
                            <h1 className='text-slate-300 hover:underline drop-shadow-xl'>GrayZone</h1>
                            
                            <motion.div
                            initial ={{opacity:0 , x:-30}}
                            animate={{
                            opacity:1,
                            x:0
                            }}
                            transition={{ ease: "easeOut", duration:0.5 }}
                            >
                            <h2 className='text-[#3decffec] hover:underline drop-shadow-xl'>Web3</h2>
                            </motion.div>
                        </div>
                </motion.div>

            </div>

            <div className='right flex justify-end md:pr-[3.5rem] lg:pr-[4.5rem] items-center w-7/12'>
                <motion.div
                    initial ={{opacity:0 , x:-400}}
                    animate={{
                    opacity:1,
                    x:0
                    }}
                    transition={{ ease: "easeOut", duration: 0.35 }}
                >
                    {/*MOBILE Menu */
                    
                    <div className='flex md:hidden lg:hidden mt-2 pr-[0.9rem]'>
                        <Image src={MenU} width={37} height={37} alt="Menu" className='border bg-gradient-to-b from-[5%] from-[#6b13d1] to-[#b67ef5] rounded-full' />
                    </div>
                    
                    }

                    
                    <div className={`hidden md:flex justify-between gap-4 mt-2 w-11/12 font-semibold text-[1.1rem]`}>
                        <div className={`w-[8rem] flex justify-center hover:underline items-center drop-shadow-lg hover:text-[1.2rem]`}>
                            <button onClick={()=> setX(true)}>
                                About Us
                            </button>
                        </div>

                        <div className='w-[8rem] flex justify-center items-center hover:underline drop-shadow-lg hover:text-[1.2rem]'>
                            <button onClick={()=> setX(true)}>
                                Products
                            </button>
                        </div>

                        <div className='w-[8rem] flex justify-center items-center bg-slate-400 rounded-3xl drop-shadow-lg h-[2rem] hover:text-[1.2rem] hover:h-[2.1rem]'>
                            <button onClick={()=> setX(true)} className="drop-shadow-lg">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
        
    </div>
  )
}

export default Header