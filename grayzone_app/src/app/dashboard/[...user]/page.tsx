"use client"
import { changeNetworkToLineaTestnet } from '@/utils/hooks'
import Link from 'next/link'
import React,{useContext, useEffect, useState} from 'react'
import Image from 'next/image'
import { DappAppContext } from '@/Context/appBockchainContext'
const lineaTestId = "0xe704"
const USERDASHBOARD =()=> {
  const{user , connectWallet,getPassInfo}= useContext(DappAppContext);
  const [passArr , setPassArr] = useState([]);
  const [b , setB] = useState(false);

  async function handler(){
    try {
      const a = await getPassInfo();
      console.log(a);
      const s = a.flat();
      console.log(s);
      setPassArr(s);
      setB(true);
      return a;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      if(!user.wallet){
        connectWallet();
      } else 
      if(user.wallet && b == false){
        handler();
      } 
      return
    } catch (error) {
      console.log(error);
    }
  }, [user, passArr])
  

  return ( 
     <div className='flex flex-col gap-[4rem]'>
      <div className='flex flex-col flex-wrap justify-center items-center font-semibold gap-1'>
        <h1 className='font-bold text-[2.5rem]'>General Info Section</h1>
        <p>Token ID: {passArr[10]}</p>
        <p>OG MINTER: {passArr[0]}</p>
        <p>Current Holder: {passArr[1]}</p>
        <p>Minted On: {passArr[4]}</p>
        <p>OG Mint Chain Id: {passArr[2]}</p>
        <p>Active Chain Id: {passArr[3]}</p>
        <p>Allocated Storage Slots:{passArr[8]} </p>
        <p>Used Storage Slots: {passArr[7]}</p>
        <p>Points Accumulated: {passArr[9]}</p>
        <p>Pass Expiry Date: {passArr[6]}</p>
      </div>

      <div className='flex flex-col justify-center items-center'>
        <h2 className='font-bold text-[2.5rem]'>ZONE SERVICES:</h2>

        <button>DECENTRALISED STORAGE SERVICE GOING ON SOON</button>
      </div>
     </div> 
   ) 
 }

export default USERDASHBOARD
