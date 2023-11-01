'use client'
//import {create as ipfsClient} from 'ipfs-http-client'
import React,{useState , useEffect, useContext} from 'react'
import { DappAppContext } from '@/Context/appBockchainContext';
import { MantleNetwork, BaseNetwork, FuseNetwork, PolygonPosNetwork } from '@/utils/networkConfigs';
import { addMantleNetwork, addFuseNetwork, addPolygonNetwork, addBaseNetwork } from '@/utils/hooks';
//import {encode as base64_encode} from 'base-64'
import { ethers } from 'ethers';
//import { ethers } from 'ethers';
//import { stringToHex } from 'viem';
//import { AbiCoder, defaultAbiCoder } from 'ethers/lib/utils';
//import HireUs from../../components/HireUs.Jsx

const styl = {
    a1:`text-[1.5rem] p-2 pl-0 font-bold font-serif drop-shadow-lg`,
    a2:`text-[1rem] flex flex-wrap font-semibold pb-2 font-serif drop-shadow-lg`,
    a3:``,
    a4:`font-semibold`,
    a5:`flex justify-center p-6 bg-[#8139e5] w-[15rem] rounded-full`,
    a6:``,
    a7:``,
    a8:``,
    a9:``,
}

const Hire = () => {
    const {connectWallet , user,submitForm , getAllForms, getChainId, getFormFee} = useContext(DappAppContext)
    const [forms , setForms] = useState([]);
    const [formData , setFormData] = useState({
        title:"",
        description:"",
        references:"",
        email:"",
        budget:0,
        timeFrame:0,
        additional:""
    })
    const [states, setStates] = useState({
        selectedNetwork:'',
        currentNetwork:"",
        currency:"",
        fee:"",
        counter:0
    })

    const handleChains=async(e)=>{
        setStates({...states, selectedNetwork:e.target.value})
        console.log(e.target.value)
        
        /*
        if(e.target.value === MantleNetwork[0].chainId && user.network === MantleNetwork[0].chainId){
            alert("Already Selected")
            return
        }
        if(e.target.value === BaseNetwork[0].chainId && user.network === BaseNetwork[0].chainId){
            alert("Already Selected")
            return
        }
        if(e.target.value === FuseNetwork[0].chainId && user.network === FuseNetwork[0].chainId){
            alert("Already Selected")
            return
        }
        if(e.target.value === PolygonPosNetwork[0].chainId && user.network === PolygonPosNetwork[0].chainId){
            alert("Already Selected")
            return
        }*/


        if(e.target.value === MantleNetwork[0].chainId && user.network != MantleNetwork[0].chainId){
          const x =  addMantleNetwork()
          const f = getFormFee()
          setStates({...states, currentNetwork:x , currency:"$MNT" , fee: f})
        }
        if(e.target.value === BaseNetwork[0].chainId &&user.network != BaseNetwork[0].chainId){
            const x = addBaseNetwork()
            const f = getFormFee()
            setStates({...states, currentNetwork:x , currency: "$ETH" , fee:f})   
        }
        if(e.target.value === FuseNetwork[0].chainId &&user.network != FuseNetwork[0].chainId){
           const x = addFuseNetwork()
           const f = getFormFee()
           setStates({...states, currentNetwork:x , currency: "$FUSE" , fee:f})
        }
        if(e.target.value === PolygonPosNetwork[0].chainId &&user.network != PolygonPosNetwork[0].chainId){
           const x = addPolygonNetwork()
           const f = getFormFee()
           setStates({...states, currentNetwork:x , currency:"$MATIC", fee:f})
        }
    }
    
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
            const obj = {
                title: formData.title,
                description: formData.description, 
                references: formData.references , 
                additional: formData.additional,
                user: user.wallet,
                budget: formData.budget,
                time: formData.timeFrame,
                contact: formData.email
            }
            await submitForm(obj.title , obj.description, obj.references, obj.additional , obj.contact, obj.time , obj.budget)
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
      if(!user.wallet){
        connectWallet();
      }else
      if(user.wallet){
        if(user.network != MantleNetwork[0].chainId &&user.network != BaseNetwork[0].chainId &&user.network != FuseNetwork[0].chainId &&user.network !=PolygonPosNetwork[0].chainId ){
            alert("Change Network to Supported Chains")
            addMantleNetwork()
        }
      }
      
    jAA()
        
    }, [user.wallet , user.network, states.fee , states.currency])

    const jAA = async()=>{
        try {
            const {results, _fee} =await getAllForms()
            setForms(results)
            //setHashes(hashes)
            const _chainId =await getChainId() 
            if(_chainId === MantleNetwork[0].chainId){
                setStates({...states, currentNetwork:"Mantle" , currency:"$MNT" , fee: _fee})
            }
            if(_chainId === FuseNetwork[0].chainId){
                setStates({...states, currentNetwork:"Fuse" , currency: "$FUSE" , fee: _fee})
            }
            if(_chainId === BaseNetwork[0].chainId){
                setStates({...states, currentNetwork:"Base" , currency: "$ETH" , fee: _fee})
            }
            if(_chainId === PolygonPosNetwork[0].chainId){
                setStates({...states, currentNetwork:"Polygon POS" , currency: "$MATIC" , fee: _fee})
            }   
            } catch (error) {
                console.log(error)
            }
    }
    
  return (
    <div className={`flex flex-col items-center justify-between bg-[#1D023C] text-white pb-[2rem]`}>
            <div className=' flex flex-col gap-6 items-center justify-between'>
                <div className='flex flex-col pt-[2rem] w-11/12 gap-[1.1rem] md:gap-[2.2rem] md:w-9/12 items-start justify-between text-left'>
                    <h2 className={styl.a1}>ARE YOU LOOKING FOR DEVELOPERS FOR YOUR WEB3 PROJECT?</h2>
                    <li className={styl.a2}>{"=>"} NOT SURE WHAT YOU NEED FOR YOUR PROJECT TO BECOME A REALITY?</li>
                    <li className={styl.a2}>{"=>"} NOT ABLE TO FIND SKILLED AND GENUINE WEB3 TALENTS?</li>
                    <li className={styl.a2}>{"=>"} GOT SCAMMED BY SOMEONE CLAIMING TO BE A DEVELOPER?</li>
                    <li className={styl.a2}>{"=>"} GOT REKT WITH MALICIOUS CODE AND UNSAFE PRACTICES?</li>

                    <h2 className={styl.a1}>YOU CAN LEAVE THAT HEADACHE TO US AND RELAX AS YOUR PROJECT COMES ALIVE!</h2>
                </div>

                <div className='flex flex-col pb-[2rem] w-11/12 md:gap-4 md:w-9/12'>
                    <h2 className={styl.a2}>WE OFFER DEVELOPMENT SERVICES RANGING FROM SIMPLE FORKS TO CUSTOM SYSTEMS</h2>
                    <h2 className={styl.a2}>OR CHOOSE FROM ONE OF THE SERVICES LISTED BELOW :</h2>
                    <div className={styl.a3}>
                        <li>Utility Tokens and NFTs creation</li>
                        <li>Meme Tokens with customised features</li>
                        <li>Staking Dapp for Tokens & NFTs</li>
                        <li>Minting Dapp for NFTs</li>
                        <li>ICO Dapps for Token sale</li>
                        <li>Decentralized Exchanges for swaps</li>
                        <li>NFT Marketplaces</li>
                        <li>Logos</li>
                        <li>UI/UX</li>
                        <li>NFT Art</li>
                        <li>Trading Bots</li>
                        <li>Telegram Bots</li>
                        <li>Websites & Landing Pages</li>
                        <li>Illustrations</li>
                        <li>AI Art & Traditional Art</li>
                        <li>Mandalas and Intricate designs</li>
                        <li>Scripts and Automations</li>
                    </div>
                </div>

                
                <h2 className={`${styl.a1} flex w-11/12 md:w-9/12`}>JUST STATE YOUR REQUIREMENTS ON THE FORM BELOW AND GET A QUOTE AND TECHNICAL GUIDANCE FOR YOUR PROJECT:</h2>
                {/*
                <h1>Looking Devs For Hire for Your Web3 Project?</h1>
                <p>We Have Got You Covered!! Hire The Best Web3 Talents Accross the Globe, Hand-Picked Specifically for your Requirements</p>
                
                <div className='w-11/12 flex flex-col'>
                    <label>Why Choose Us?</label>
                    <li>Access to TOP 1% of Verified Web3 Talents</li>
                    <li>Web3 can be Confusing , So we Provide Free Of Cost Guidance in Deciding Your Projects Technical Details to Achieve Desired Goals</li>
                    <li>Matchmaking of Talents/Teams for Your Specific and Custom Requirement</li>
                    <li>Facilitating Client-Talent Communications so Nothing gets Missed</li>
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
            */}
            </div>
                
            <div className='gap-2 flex flex-col w-11/12 md:w-[40rem] pt-[2rem]'>
            
                <p className='pb-4 font-semibold'>Select Chain Below for D-Form Submission:</p>
                <select value={states.selectedNetwork} onChange={(e)=>handleChains(e)} className='text-black'>
                    <option>Select</option>
                    <option value={MantleNetwork[0].chainId}>Mantle Mainnet</option>
                    <option value={PolygonPosNetwork[0].chainId}>Polygon POS Mainnet</option>
                    <option value={BaseNetwork[0].chainId}>Base Mainnet</option>
                    <option value={FuseNetwork[0].chainId}>Fuse Mainnet</option>
                </select>

                <p className='p-4 pl-0 font-semibold'>Your Current Network: {states.currentNetwork ? <>{states.currentNetwork}</> :"Unsupported Chain"}</p>
        
                <div className='gap-4 flex bg-transparent flex-col'>
                    <p className={styl.a4}>Enter Subject Title {"( eg: NFT MARKETPLACE WITH DEX)"}:</p>
                    <input  type={'text'} onChange={(e)=> titleHandler(e.target.value)} className='h-[2.6rem]' placeholder='Title'/>
                    <p className={styl.a4}>Enter Description:</p>
                    <input type={'text'} onChange={(e)=> setFormData({...formData , description: e.target.value})} placeholder='Requirement Decription' className='h-[6rem]'/>
                    <p className={styl.a4}>Enter References {"( Links Preffered if Any Available )"}: </p>
                    <input type={'text'} onChange={(e)=> setFormData({...formData , references: e.target.value})}  placeholder='References' className='h-[6rem]'/>
                    <p className={styl.a4}>Enter Desired Budget in USD :</p>
                    <input type={'number'} onChange={(e)=> setFormData({...formData , budget: e.target.value})} className='h-[2.6rem]' placeholder="Budget In $"/>
                    <p className={styl.a4}>Enter Desired Timeframe in Days :</p>
                    <input type={'number'} onChange={(e)=> setFormData({...formData , timeFrame: e.target.value})} className='h-[2.6rem]' placeholder="Timeframe In days"/>
                    <p className={styl.a4}>Any Additional Info :</p>
                    <input type={'text'} onChange={(e)=> setFormData({...formData , additional: e.target.value})} placeholder='Additional Requirements - If Any' className='h-[6rem]'/>
                    <p className={styl.a4}>Your Contact Detail {"( We Will Contact you Here within 24 hours of Submission )"}</p>
                    <input type={'text'} onChange={(e)=> emailHandler(e.target.value)} placeholder='Email or TG Handle' className='h-[2.6rem]'/> 
                </div>
                <div className='flex justify-center p-[2rem]'>
                    <button className={styl.a5} onClick={()=> IpfsHandle()}>SUBMIT FOR {states.fee} {states.currency}</button>          
                </div>                
            </div>


            <p>Submitting A Hire Form Requires A Small Fee of {states.fee ? <>{states.fee}</> :"Wrong Network ..."} {states.currency ? <>{states.currency}</> : "UNSUPPORTED NETWORK"} for User Verification Purposes and Stop Spams</p>
        
    </div>
  )
}

export default Hire