"use client"
import { changeNetworkToLineaTestnet } from '@/utils/hooks'
import Link from 'next/link'
import React,{useContext, useEffect, useState} from 'react'
import Image from 'next/image'
import { DappAppContext } from '@/Context/appBockchainContext'
import { ethers } from "ethers";

const lineaTestId = "0xe704"
const lineaweth = "0x2C1b868d6596a18e32E61B901E4060C872647b6C"

const USERDASHBOARD =()=> {
  const{user , connectWallet,getPassInfo , getIdBalance}= useContext(DappAppContext);
  const [passArr , setPassArr] = useState([]);
  const [b , setB] = useState(false);
  const [balances , setBalances] = useState({
    weth:'',
    selectToken:''
  })
  const [ad , setAd] = useState("");
  

  const getBalances=async(token:string)=>{
    try {
      const w = await getIdBalance(passArr[10], lineaweth);
      const str = ethers.utils.formatUnits(w , 18);
      console.log(str)
      //console.log(wth);
      const ss = await getIdBalance(passArr[10], token);
      const as = ethers.utils.formatUnits(ss , 18);
      setBalances({weth:str , selectToken: as.toString()})
     // const bal = await getIdBalance(token);
     // const decimal = await
    } catch (error) {
      console.log(error);
    }
  }

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
        
        getBalances(ad);
        
      } 
      return
    } catch (error) {
      console.log(error);
    }
  }, [user, passArr, ad, balances.selectToken])
  

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
      
      <div>
        <p>ID DEPOSIT BALANCE Details</p>
        <p>ID Weth Balances: {balances.weth ? <>{balances.weth}</>:"0"} </p>
        <p>Selected Token Balances: {balances.selectToken?<>{balances.selectToken}</>:"0"}</p>
        <input type={'text'} placeholder="Enter Token Address" onChange={(e)=> setAd(e.target.value)}/>
        <button onClick={()=> getBalances(ad)}>Fetch Balances</button>
      </div>

      <div className='flex flex-col'>
        Deposit To Pass:
        <input type={'text'} placeholder="Enter Token Address" onChange={(e)=> setAd(e.target.value)}/>
        <input type={'number'} placeholder="Enter Amount to Deposit" onChange={(e)=> setAd(e.target.value)}/>
        <button>Trigger Deposit</button>
      </div>

      <div className='flex flex-col'>
        Withdraw From Pass:
        <input type={'text'} placeholder="Enter Token Address" onChange={(e)=> setAd(e.target.value)}/>
        <input type={'number'} placeholder="Enter Amount to Deposit" onChange={(e)=> setAd(e.target.value)}/>
        <button>Trigger Withdraw</button>
      </div>
      
      <div className='flex flex-col justify-center items-center'>
        <h2 className='font-bold text-[2.5rem]'>ZONE SERVICES:</h2>

        <button>DECENTRALISED STORAGE SERVICE GOING ON SOON</button>
      </div>
     </div> 
   ) 
 }

export default USERDASHBOARD
