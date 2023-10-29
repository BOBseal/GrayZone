'use client'
import React,{useState , useEffect, useContext} from 'react'
import { DappAppContext } from '@/Context/appBockchainContext';
import { MantleNetwork } from '@/utils/networkConfigs';
import { addMantleNetwork } from '@/utils/hooks';
//import HireUs from../../components/HireUs.Jsx

const page = () => {
    const {connectWallet , user,submitForm , getAllForms, isPassholder} = useContext(DappAppContext)
    const [forms , setForms] = useState([]);
    const [hashes , setHashes] = useState()
    useEffect(() => {
      if(!user.wallet){
        connectWallet();
      }else
      if(user.wallet){
        if(user.network != MantleNetwork.chainId){
            addMantleNetwork()
        }
      }
      
    jAA()
        
    }, [user.wallet , user.network])

    const jAA = async()=>{
        try {
            
            const results =await getAllForms()
            setForms(results)
            //setHashes(hashes)
            
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div className={`flex items-center justify-center bg-[#1D023C] text-white pb-[2rem]`}>
        <div className='flex flex-col w-11/12 justify-between items-center'>
        <div className=' flex flex-col gap-6'>
            <h1>Looking Devs For Hire for Your Web3 Project?</h1>
            <p>We Have Got You Covered!! Hire The Best Web3 Talents Accross the Globe, Hand-Picked Specifically for your Requirements</p>
            
            <div className='w-11/12 flex flex-col'>
                <label>Why Choose Us?</label>
                <li>Access to TOP 1% of Verified Web3 Talents</li>
                <li>Web3 can be Confusing , So we Provide Free Of Cost Guidance in Deciding Your Project's Technical Details to Achieve Desired Goals</li>
                <li>Matchmaking of Talents/Teams for Your Specific and Custom Requirement</li>
                <li>Facilitating Client-Talent Communications so Nothing gets "Missed"</li>
                <li>We Employ a Strict and Meticulous Screening and Choose Only the Best and Most Suitable of Talents</li>
                <li>24/7 Assistance</li>
            </div>

            <div>
              <label>⏩We offer the following:⏩</label>
                    <li>  Utility Tokens and NFT creation</li>
                    <li> Meme Tokens and Website</li>
                    <li> Metadata Creation</li>
                    <li> Staking Dapp for Tokens & NFTs</li>
                    <li> Mint Dapp for NFTs</li>
                    <li> ICO Dapps for Token sale</li>
                    <li> Decentralized Exchanges for swaps</li>
                    <li> NFT Marketplace</li>
                    <li> Customised Dapps with Custom Functionalities</li>
                    <li>  Logos</li>
                    <li> UI/UX</li>
                     <li> NFT Art</li>
                     <li>  NFT Art</li>
                     <li> Trading Bots</li>
                      <li> Telegram Bots</li>
                     <li>Landing Pages</li>
                     <li>Personal Websites</li>
                     <li> Business Websites </li>
                     <li> Illustrations</li>
                     <li>Social Media Management</li>
                     <li>AI Art & Traditional Art</li>
                     <li>Mandalas and Intricate designs</li>
                     <li>Project Management</li>
                      <li>Client Matching with Talent</li>
                      <li> Product Photography/Videography</li>
                      <li> Video Editing</li>
                     <li> Photo Editing</li>
                    <li> Automation Solutions</li> 
                
            </div>

            <div>
                <label>Our Core Team:</label>
                <div>
                    <p>BOB</p>
                </div>
                <div>
                    <p>DEEP</p>
                </div>
                <div>
                    <p>RAZY</p>
                </div>
            </div>
        
        </div>
        
        <form className='gap-2 flex flex-col w-11/12 md:w-[40rem]'>
            <p>Hire Us Form:</p>
            <div className='gap-2 flex text-black flex-col'>
                <input type={'text'} placeholder='Title'/>
                <input type={'text'} placeholder='Requirement Decription' className='h-[6rem]'/>
                <input type={'text'} placeholder='References' className='h-[6rem]'/>
                <input type={'number'} placeholder="Budget In $"/>
                <input type={'number'} placeholder="Timeframe In days"/>
                <input type={'text'} placeholder='Additional Requirements - If Any' className='h-[6rem]'/>
            </div>
            
        </form>

        <button onClick={()=> submitForm("HELLO" , "0x01" , "boba@gmail.com" , 12 , 123)}>SUBMIT</button>

        <p>Submitting A Hire Form Requires A Small Fee of 5$ in ETH for User Verification Purposes and Stop Spams</p>
    </div>
    </div>
  )
}

export default page