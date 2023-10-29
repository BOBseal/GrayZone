'use client'
import {create as ipfsClient} from 'ipfs-http-client'
import React,{useState , useEffect, useContext} from 'react'
import { DappAppContext } from '@/Context/appBockchainContext';
import { MantleNetwork } from '@/utils/networkConfigs';
import { addMantleNetwork } from '@/utils/hooks';
import {encode as base64_encode} from 'base-64'
import { ethers } from 'ethers';
import { stringToHex } from 'viem';
import { AbiCoder, defaultAbiCoder } from 'ethers/lib/utils';
import dotenv from 'dotenv'
dotenv.config();
//import HireUs from../../components/HireUs.Jsx

const page = () => {
    const {connectWallet , user,submitForm , getAllForms, isPassholder} = useContext(DappAppContext)
    const [forms , setForms] = useState([]);
    const [hashes , setHashes] = useState()
    const [formData , setFormData] = useState({
        title:"",
        description:"",
        references:"",
        email:"",
        budget:0,
        timeFrame:0,
        additional:""
    })
    const projectId = "2XSB3KFypeJTlvNLydKcCwWRdnk"
    const projectSecret = "943c4fe5855393217b8bc6a352b59705"
    const authorisation = projectId + ":" + projectSecret;
    const encode = base64_encode(authorisation)
    const ipfs = new ipfsClient({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          Authorization: "Basic " + encode,
        },
      });
    
    const titleHandler = (e)=>{
        try {
            setFormData({...formData, title:e})
        } catch (error) {
            console.log(error)
        }
    }

    const emailHandler = (e)=>{
        try {
            setFormData({...formData, email:e})
        } catch (error) {
            console.log(error)
        }
    }

    const IpfsHandle = async()=>{
        try {
            if(!formData.title ||!formData.description ||!formData.email || formData.budget == 0 || formData.timeFrame == 0){
                alert("Title , Description , Contact Detail , Budget and Timeframe Cannot be Empty")
                return
            }
            let obj = {
                title: formData.title,
                description: formData.description, 
                references: formData.references , 
                additional: formData.additional,
                user: user.wallet,
                budget: formData.budget,
                time: formData.timeFrame,
                contact: formData.email
            }
            const JsonObj = JSON.stringify(obj);
            const file = new Blob([JsonObj]);
            const buffer = await new Response(file).arrayBuffer()
            const upload = await ipfs.add(buffer);
            console.log(upload)
            if(upload.path !=""){
                submitForm(formData.title , upload.path , formData.email , formData.timeFrame , formData.budget)
            }
        } catch (error) {
            console.log(error)
        }
    }

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
        
        <div className='gap-2 flex flex-col w-11/12 md:w-[40rem]'>
            <p>Hire Us Form:</p>
            <div className='gap-2 flex text-black flex-col'>
                <input type={'text'} onChange={(e)=> titleHandler(e.target.value)} placeholder='Title'/>
                <input type={'text'} onChange={(e)=> setFormData({...formData , description: e.target.value})} placeholder='Requirement Decription' className='h-[6rem]'/>
                <input type={'text'} onChange={(e)=> setFormData({...formData , references: e.target.value})}  placeholder='References' className='h-[6rem]'/>
                <input type={'number'} onChange={(e)=> setFormData({...formData , budget: e.target.value})} placeholder="Budget In $"/>
                <input type={'number'} onChange={(e)=> setFormData({...formData , timeFrame: e.target.value})} placeholder="Timeframe In days"/>
                <input type={'text'} onChange={(e)=> setFormData({...formData , additional: e.target.value})} placeholder='Additional Requirements - If Any' className='h-[6rem]'/>
                <input type={'text'} onChange={(e)=> emailHandler(e.target.value)} placeholder='Email or TG Handle' className='h-[2.6rem]'/> 
            </div>
            
        </div>
        <button onClick={()=> IpfsHandle()}>SUBMIT D-FORM</button>

        <p>Submitting A Hire Form Requires A Small Fee of 10 $MNT for User Verification Purposes and Stop Spams</p>
    </div>
    </div>
  )
}

export default page