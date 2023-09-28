"use client"
import React from 'react'
import Image from 'next/image'

const MINTPASS = () => {

  const a =()=>{
    alert("UNDER CONSTRUCTION");
  }
  return (
  <div className="flex h-full min-w-screen bg-[#1D023C] relative flex-wrap pb-[2rem]">
      
      <Image src={'/Assets/bgImg.svg'} width={0} height={0} alt="GrayZone" className={`h-full w-screen object-cover md:object-cover absolute top-0 left-0`}/>

      <div className={`${`bg-white text-black`} flex flex-col justify-center items-center gap-0 h-full w-full bg-[#1D023C]`}> 
           
            <div className='flex flex-col bg-transparent mt-[4.5rem] w-full h-full items-center justify-center'>
              <div className='z-0 h-full w-full -mt-16 p-4 flex flex-col items-center gap-2'>
                  
                  <div className='w-11/12 md:w-[45rem] lg:w-[35rem] flex flex-wrap gap-3'>
                    <h2 className=' text-lg font-semibold underline text-white underline-offset-2 font-serif'>ABOUT ZONEPASS:</h2> 
                    <p className=' text-xs pl-2 font-sans text-gray-200'>ZONEPASS IS AN "ALL IN ONE" NFT PROFILE FOR USERS. IT SERVES AS THE GATEWAY TO GRAYZONE ECOSYSTEM AND HAS COOL FEATURES LIKE PASSIVE INCOME
                      FOR OG MINTER , DECENTRALISED STORAGE WITH STORAGE SHARING , NFT BASED STORE OF VALUE AND MANY MANY MORE!!.
                      ALL HOLDERS AS WELL AS OG MINTERS GET DISCOUNTS , ACCESS TO GRAYTOOLS , BONUSES , WL, SERVE AS WEB3 ATTESTATION "ACTIVITY BASED" , GIVEAWAYS AS WELL AS MANY MANY 
                      "SECRET" BENIFITS AS WE MOVE FORWARD. MINT YOUR ALPHA PASS AND STAY TUNED TO FIND OUT MORE!!!
                    </p>
                  </div>

                  <div className='w-11/12 md:w-[45rem] lg:w-[35rem] flex flex-wrap gap-3 flex-col pb-6'>
                    <h2 className=' text-lg font-semibold underline text-white underline-offset-2 font-serif'>HOW TO MINT?</h2> 
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 1: GET SOME GOERLI ETHER FROM FAUCETS FOR GAS FEE</p>
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 2: MINT YOUR ALPHA EDITION ZONEPASS ON GOERLI</p>
                  </div>

                  <div className='w-11/12 md:w-[45rem] lg:w-[35rem] flex flex-col bg-[#9041ff] items-center gap-4 border-[2px] rounded-2xl p-8'>
                    <div className='flex justify-center items-center w-full md:w-7/12 lg:w-[600px] bg-opacity-40 rounded-2xl lg:-mt-[1px] p-6 lg:pt-[3rem] lg:pb-[3rem]'>
                      <Image src={'/Assets/logo.svg'} width={300} height={200} alt="GRAYZONE WEB3" className='flex object-contain h-[250px] w-[300px] md:w-[500px] lg:w-[1200px] drop-shadow-2xl'/>
                    </div>
                  
                    <button onClick={()=> alert("UNDER CONSTRUCTION , MEANWHILE FOLLOW US ON TELEGRAM and LINKEDIN")} className='bg-[#56239d] border p-6 rounded-3xl font-bold text-slate-200 font-serif'>MINT ZONEPASS: G-ALPHA</button>
                  </div>

              </div>
            </div> 
      </div>
     
    </div>
    )
}

export default MINTPASS