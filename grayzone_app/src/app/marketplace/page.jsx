'use client'
import React,{useState , useEffect, useContext} from 'react'
import { DappAppContext } from '@/Context/appBockchainContext';
const MarketPlace = () => {
  const {user , getAllListings, connectWallet} = useContext(DappAppContext);

  const get = async()=>{
    try {
      console.log("1")
      getAllListings();
      console.log("end")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    try {
      
      if(!user.wallet){
        connectWallet();
      }
      return
    } catch (error) {
      console.log(error);
    }
  }, [user])

  return (
    <div className='flex flex-col items-center justify-center bg-[#1D023C] text-white'>
      <div>
        <h1>GRAYZONE MARKETPLACE</h1>
        <div>
         Latest Listings
         <button onClick={()=> get()}>GET</button>
        </div>
      </div>


    </div>
  )
}

export default MarketPlace