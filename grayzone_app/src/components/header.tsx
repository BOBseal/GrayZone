"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import MenU  from '../../public/Assets/icons8-hamburger-menu-128.svg';
import Link from 'next/link';
//import { homelink } from '@/utils/hooks';
import Products from './Products.jsx';

const styl = {
    menu: 'hover:underline drop-shadow-lg font-semibold p-1 rounded-full w-[14rem] flex justify-center '
}

const Header = () => {
   // const [x, setX ] = useState(false); // menu opener
    const [controllers , setC] = useState({
        products:false,
        menu:false
    })

    const productMenuHandler =()=>{
        try {
            if(controllers.products){
                setC({...controllers, products: false})
            }
            if(!controllers.products){
                setC({...controllers, products: true})
            }
        } catch (error) {
            console.log(error);
        }
    }

    const menuHandler =()=>{
        try {
            if(controllers.menu){
                setC({...controllers, menu: false})
                console.log(controllers)
            }
            if(!controllers.menu){
                setC({...controllers, menu: true})
                console.log(controllers)
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='sticky -top-1 h-[4.2rem] md:h-[4.5rem] w-full z-40 border-b-[2px] drop-shadow-m bg-gradient-to-br to-[#b67ef5] from-[#1D023C] from-10% to-85%'>
        
        <div className='h-full w-full flex justify-between gap-1 text-[#FFFFFF]'>
            
            <div className='left flex gap-2 w-5/12 justify-start pl-[1.2rem] md:pl-[3.3rem] items-center mt-2 cursor-pointer group'>
                
            <Image src={'/Assets/logo.svg'} height={40} width={40} alt="GrayZone Logo" className='drop-shadow-xl'/>
                <AnimatePresence>
                <motion.div
                    initial ={{opacity:0 , x:-20}}
                    animate={{
                    opacity:1,
                    x:0
                    }}
                    transition={{ ease: "easeOut", duration: 0.8 }}
                    > 
                    
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
                    
                    <div className='flex md:hidden lg:hidden mt-2 pr-[0.9rem]' onClick={()=> menuHandler()}>
                        <Image src={MenU} width={37} height={37} alt="Menu" className='border bg-gradient-to-b from-[5%] from-[#6b13d1] to-[#b67ef5] rounded-full' />
                    </div>
                    
                    }
                    {controllers .menu ? 
                    <div className='absolute top-[4.23rem] md:top-[4.5rem] w-[13rem] z-50 border shadow-xl right-0 bg-gradient-to-r to-[#b67ef5] from-[#1D023C] from-10% to-85% rounded-lg p-8 md:hidden lg:hidden pt-4 pb-4 pr-[0.9rem] items-center justify-center' onClick={()=> menuHandler()}>
                        
                        <div className='flex flex-col justify-center items-center gap-2 p-4 drop-shadow-lg' onClick={()=> productMenuHandler()}>
                            <Link href={'/'}><p className={styl.menu}>HOME</p></Link>
                            <Link href={'/dashboard'}><p className={styl.menu}>DASHBOARD</p></Link>
                            <Link href={'/'}><p onClick={()=>alert("Associate Your Wallets or Zonepass with a Culture Badges : Coming Soon")} className={styl.menu}>Culture Badges</p></Link>
                            {/*<Link href={'/'}><p className={styl.menu}>ERC20 TOOLS</p></Link>
                            <Link href={'/'}><p className={styl.menu}>ERC721 TOOLS</p></Link>
                            <Link href={'/'}><p className={styl.menu}>ERC1155 TOOLS</p></Link>
                            <Link href={'/'}><p className={styl.menu}>AUTOPAY</p></Link>
                            <Link href={'/'}><p className={styl.menu}>LENDING/BORROWING</p></Link>
                            <Link href={'/'}><p className={styl.menu}>DEX</p></Link>
                            <Link href={'/'}><p className={styl.menu}>NFT MARKETPLACE</p></Link>*/}
                            <Link href={"/hire"}>
                                <div className={styl.menu}>
                                    HIRE US
                                </div>
                            </Link>
                        </div>
                        
                    </div> :""}

                    {/*DESKTOP MENU*/}
                    <div className={`hidden md:flex justify-between gap-4 mt-2 w-11/12 font-semibold text-[1.1rem]`}>
                        
                        <div className={`w-[8rem] flex justify-center hover:underline items-center drop-shadow-lg hover:text-[1.2rem]`}>
                            <Link href={`/`}>
                                <button>
                                    Home
                                </button>
                            </Link>
                        </div>

                        <div className='w-[8.3rem] flex justify-center items-center drop-shadow-lg'>
                            <div onClick={()=> productMenuHandler()} className='flex gap-[5px] hover:underline hover:text-[1.2rem] items-center justify-center'>
                               
                               <button>Our Products</button>
                               
                               
                               <Image src={'/Assets/down-arrow-backup-2-svgrepo-com.svg'} width={12} height={20} alt="arrow" className=' justify-center mt-[4px] hidden'/>
                            </div>
                            {controllers.products? <Products functions={productMenuHandler}/>: ""}
                        </div>

                        <div className='w-[8rem] flex justify-center items-center bg-slate-400 rounded-3xl drop-shadow-lg h-[2rem] hover:text-[1.2rem] hover:h-[2.1rem]'>
                            <Link href={"/hire"}>
                                <button className="drop-shadow-lg">
                                    HIRE US
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