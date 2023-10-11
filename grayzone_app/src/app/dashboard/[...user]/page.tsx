"use client"
import { changeNetworkToLineaTestnet } from '@/utils/hooks'
import Link from 'next/link'
import React,{useContext, useEffect, useState} from 'react'
import Image from 'next/image'
import { DappAppContext } from '@/Context/appBockchainContext'
const lineaTestId = "0xe704"
const USERDASHBOARD =()=> {
  const{user , connectWallet,getPassInfo }= useContext(DappAppContext);
  const [passArr , setPassArr] = useState([]);
  const [b , setB] = useState(false);

  useEffect(() => {
    try{if(user.network !=lineaTestId){
      connectWallet();
    }
    if(passArr.length <1 && b ==false){
      const a= getPassInfo();
     // a.wait()
      setB(true);
      setPassArr(a);
      console.log(a);
    }
  } catch(error){
      console.log(error)
    }
  }, [user, b, passArr])
  return ( 
     <div>

     </div> 
   ) 
 }

export default USERDASHBOARD
