"use client"
import { changeNetworkToLineaTestnet } from '@/utils/hooks'
import Link from 'next/link'
import React,{useContext, useEffect, useState} from 'react'
import Image from 'next/image'
import { DappAppContext } from '@/Context/appBockchainContext'
const lineaTestId = "0xe704"
const MINTPASS = () => {
  const{user , connectWallet, mint, isPassholder, getPassInfo , getChainId}= useContext(DappAppContext);
  const [isholder, setisHolder] = useState(false);
  let tx;
  const a = async()=>{
     try{ 
      if(!user.wallet){
        connectWallet();
      }
      if(user.wallet){
       // console.log(user.wallet , user.network);
        const t = await mint();
       // console.log(t);
      }
      if(user.network !=lineaTestId){
        connectWallet();
      }
      else return false
    }catch (error){
        console.log(error);
      }
  }

  const handler=async()=>{
    try {
      const num = await isPassholder();
      if(num >0 ){
        setisHolder(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try{
      if
      (user.network !=lineaTestId){
        connectWallet()
        changeNetworkToLineaTestnet()
    }
    handler()} catch(error){
      console.log(error)
    }
  }, [user , isholder])
  
  return (
  <div className="flex bg-[#1D023C] min-h-screen h-full min-w-screen relative flex-wrap pb-[2rem]">
      
      
      <div className={`${`bg-[#1D023C] text-black`} flex flex-col justify-center items-center gap-0 h-full w-full bg-[#1D023C]`}> 
           
            <div className='flex flex-col bg-[#1D023C] mt-[4.5rem] w-full h-full items-center justify-center'>
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
                    <h3 className=' text-lg font-semibold underline text-white underline-offset-2 font-serif'>HOW TO MINT?</h3>
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 1: CONNECT WALLET</p> 
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 2: GET SOME LINEA TEST ETHER FROM FAUCETS FOR GAS FEE</p>
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 3: MINT YOUR ALPHA EDITION ZONEPASS ON LINEA GOERLI TESTNET</p>
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 4: RELOAD THIS PAGE</p> 
                  </div>

                  <div className='w-11/12 md:w-[45rem] lg:w-[35rem] flex flex-col bg-[#9041ff] items-center gap-4 border-[2px] rounded-2xl p-8'>
                    <div className='flex justify-center items-center w-full md:w-7/12 lg:w-[600px] bg-opacity-40 rounded-2xl lg:-mt-[1px] p-6 lg:pt-[3rem] lg:pb-[3rem]'>
                      <Image src={'/Assets/logo.svg'} width={300} height={200} alt="GRAYZONE WEB3" className='flex object-contain h-[250px] w-[300px] md:w-[500px] lg:w-[1200px] drop-shadow-2xl'/>
                    </div>
                  
                    <div onClick={()=>a() } className='bg-[#56239d] border p-6 rounded-3xl font-bold text-slate-200 font-serif'>{ !user.wallet? "CONNECT WALLET": 
                    <>{
                      isholder ? <>
                      <Link href={`/dashboard`}>
                        <button>GO TO DASHBOARD</button>
                      </Link></>:<button>"MINT PASS"</button>
                    }</>}
                    </div>
                  </div>


                   <div className='w-11/12 md:w-[43rem] lg:w-[35rem] flex flex-wrap gap-3 flex-col pt-[40px]'>
                    <h3 className=' text-lg font-semibold underline text-white underline-offset-2 font-serif'>WHAT ARE THE BENIFITS OF MINTING ALPHA(TESTNET) EDITION ZONEPASS?</h3>
                    <p className=' text-xs pl-2 font-sans text-gray-200 w-10/12'> 1: Rewards For All Early Contributors in The Form of Exclusive Platform Benifits by Sharing us your reviews and user experience</p> 
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 2: Whitelist to Recieve MAINNET EDITION upon Mainnet Launch</p>
                    <p className=' text-xs pl-2 font-sans text-gray-200'> 3: Future Allocation and Exciting Rewards</p>
                    <p className=' text-lg pl-2 font-sans text-gray-200 font-semibold'> Stay Tuned for Participation,Rules and More Details!!</p>
                    <div className='flex justify-center items-center'>
                    <p className=' flex w-[15rem] h-[3rem] justify-center items-center text-center rounded-full text-lg pl-2 font-sans font-semibold cursor-pointer text-gray-200 bg-gradient-to-br to-[#b67ef5] from-[#1D023C] from-10% to-85% p-4'><Link href={`https://x.com/grayzoneweb3?t=VHrihi13p99Nxoc1K2yUQQ&s=09`}>FOLLOW US ON TWITTER </Link></p>
                    </div>
                  </div>   
              </div>
            </div> 
      </div>
     
    </div>
    )
}

export default MINTPASS