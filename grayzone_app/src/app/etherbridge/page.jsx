'use client'

import React,{useState , useEffect, useContext} from 'react'
import { DappAppContext } from '@/Context/appBockchainContext';
import { OPMainnet, LineaMainnet } from '@/utils/networkConfigs';
import { changeNetworkToLineaMainnet,addOPNetwork} from '@/utils/hooks';

const Index = () => {
  const {connectWallet,user,bridgeEth,setBridgeEthObject, bridgeEthObject, estimateBridgeTotalCost, getChainId} = useContext(DappAppContext);
  
  useEffect(() => {
    if(!user.wallet){
      connectWallet();
    }else
    if(user.wallet){
      if(user.network != OPMainnet[0].chainId &&user.network != LineaMainnet[0].chainId){
          alert("Change Network to Supported Chains")
          changeNetworkToLineaMainnet();
      }
    }
      
  }, [user.wallet , user.network])

  
  return (
    <div className={`flex min-h-[800px] md:min-h-[860px] flex-col items-center justify-evenly bg-[#1D023C] text-white pb-[2rem]`}>
        <h1 className='flex text-[1.85rem] md:text-[2.8rem]'>GRAY-BRIDGE (BETA)</h1>
        
        <div className={`w-[90%] md:w-[40rem] shadow-xl justify-center items-center h-[30rem] z-10`}>
          <div className='flex w-full p-[1rem] border-[4px] border-black h-full bg-gradient-to-br from-[5%] rounded-2xl from-[#6b13d1] to-[#381066] justify-center items-center'>
              <div className='flex flex-col justify-between gap-1 p-[1.5rem] w-full h-full border-[4px] rounded-2xl border-black bg-[#a38bbcc0]'>
                  
                  <div className='border rounded-2xl flex flex-col h-[90%] w-full items-center justify-between'>
                    <div className='flex flex-col w-full justify-center h-[95%] items-start gap-[1rem]'>
                      <div className='flex flex-col p-[1rem] w-full'>
                        <div className='flex justify-between'>
                          <p>FROM :</p>
                          <select placeholder='select network' className='text-black'>
                            <option>LINEA</option>
                            <option>OPTIMISM</option>
                          </select>
                        </div>
                        <div className='flex justify-between'>
                          <p>TO :</p>
                          <select placeholder='select network' className='text-black'>
                            <option>OPTIMISM</option>
                            <option>LINEA</option>
                          </select>
                        </div>
                      </div>  
                      
                      <div className='flex flex-col justify-between items-start w-full p-[1rem]'>
                        <p>platform fee: 0.0001 ETH</p>
                        <p>total cost: 1 ETH</p>
                      </div>
                      <div className=' flex flex-col justify-center items-center w-full'>
                        <p>Enter Amount To Recieve:</p>
                        <input type={'number'} className='text-black flex w-full'/>
                      </div>
                    </div>
                    <div className='flex text-sm justify-between items-center gap-[0.5rem] md:gap-[5rem] p-[5px]'>
                      <p>Balance: {user.balance? <>{user.balance} ETH</>:"0"}</p>
                    </div>
                  </div>
   
                  <div className='flex justify-center'>
                    <button className=' -mt-[1rem] bg-purple-700 rounded-full p-[0.1rem] w-[5rem]'>BRIDGE</button>
                  </div>
                      
              </div>
              
          </div>
        </div>
        
    </div>
  )
}

export default Index