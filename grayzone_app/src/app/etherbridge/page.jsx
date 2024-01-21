'use client'

import React,{useState , useEffect, useContext} from 'react'
import { DappAppContext } from '@/Context/appBockchainContext';
import { OPMainnet, LineaMainnet } from '@/utils/networkConfigs';
import { changeNetworkToLineaMainnet,addOPNetwork} from '@/utils/hooks';
import { EthBridge } from '@/utils/constants';

const Index = () => {
  const {connectWallet,user,bridgeEth,setBridgeEthObject, bridgeEthObject, estimateBridgeTotalCost, getChainId} = useContext(DappAppContext);
  const [data , setData] = useState({
    fromChain: LineaMainnet[0].chainId,
    toChain: OPMainnet[0].chainId,
    totalCost:'',
    minOut:''
  })

  const [states, setStates] = useState({
    feeScreen: false,
  })

  const setBridgeData = async(e)=>{
    if(data.fromChain === LineaMainnet[0].chainId && data.toChain === OPMainnet[0].chainId){
      const amnt = e.target.value.toString()
      setBridgeEthObject({...bridgeEthObject,amount:amnt,srcLzoId: EthBridge.linea.lzoId, dstLzoId:EthBridge.op.lzoId})
    }
    if(data.fromChain === OPMainnet[0].chainId && data.toChain === LineaMainnet[0].chainId){
      const amnt = e.target.value.toString()
      setBridgeEthObject({...bridgeEthObject,amount:amnt,srcLzoId: EthBridge.op.lzoId, dstLzoId:EthBridge.linea.lzoId})
    }
    const x = await estimateBridgeTotalCost(e.target.value);
    setData({...data,totalCost:x})
  }

  const selectorHandlerFrom = async(e)=>{
    try {
      if(e.target.value === LineaMainnet[0].chainId){
        setData({...data, fromChain: e.target.value, toChain: OPMainnet[0].chainId});
        changeNetworkToLineaMainnet();
      } 
      if(e.target.value ===OPMainnet[0].chainId) {
        setData({...data, fromChain: e.target.value, toChain: LineaMainnet[0].chainId});
        addOPNetwork();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const selectorHandlerTo = async(e)=>{
    try {
      if(e.target.value === data.fromChain){
        alert("cant be same")
        return;
      }
      if(e.target.value === LineaMainnet[0].chainId){
        setData({...data, toChain: e.target.value });
        changeNetworkToLineaMainnet();
      } 
      if(e.target.value ===OPMainnet[0].chainId) {
        setData({...data, toChain: e.target.value});
        addOPNetwork();
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
      if(user.network != LineaMainnet[0].chainId){
          alert("Change Network to Supported Chains")
      }
    }
      
  }, [user.wallet])

  
  return (
    <div className={`flex min-h-[800px] md:min-h-[860px] flex-col items-center justify-center gap-[4rem] bg-[#1D023C] text-white pb-[2rem]`}>
        <h1 className='flex text-[1.85rem] md:text-[2.8rem]'>GRAY-BRIDGE (BETA)</h1>
        
        <div className={`w-[90%] md:w-[40rem] shadow-xl justify-center items-center h-[30rem] z-10`}>
          <div className='flex w-full p-[1rem] border-[4px] border-black h-full bg-gradient-to-br from-[5%] rounded-2xl from-[#6b13d1] to-[#381066] justify-center items-center'>
              <div className='flex flex-col justify-between gap-1 p-[1.5rem] w-full h-full border-[4px] rounded-2xl border-black bg-[#a38bbcc0]'>
                  
                  <div className='border rounded-2xl flex flex-col h-[90%] w-full items-center justify-between'>
                    <div className='flex flex-col w-full justify-center h-[95%] items-start gap-[1rem]'>
                      <div className='flex flex-col p-[1rem] w-full gap-2'>
                        <div className='flex justify-between'>
                          <p>FROM :</p>
                          <select placeholder='select network' className='text-black' defaultValue={data.fromChain} onChange={(e)=>selectorHandlerFrom(e)}>
                            <option value={LineaMainnet[0].chainId}>LINEA</option>
                            <option value={OPMainnet[0].chainId}>OPTIMISM</option>
                          </select>
                        </div>
                        <div className='flex justify-between'>
                          TO : <p>{data.fromChain === LineaMainnet[0].chainId? "OPTIMISM":"LINEA"}</p>
                        </div>
                      </div>  
                      
                      <div className='flex text-sm flex-col justify-between w-full p-[1rem]'>
                        <p>Our Platform Fee = 0.25$ in ETH</p>
                      </div>
                      <div className=' flex flex-col justify-center items-center w-full'>
                        <p>Enter Amount To Recieve:</p>
                        <input type={'number'} className='text-black flex w-full' onChange={(e)=>setBridgeData(e)}/>
                        <p>total cost: {data.totalCost? data.totalCost:"0.00"}</p>
                      </div>
                    </div>
                    <div className='flex text-sm justify-between items-center gap-[0.5rem] md:gap-[5rem] p-[5px]'>
                      <p>Balance: {user.balance? <>{user.balance} ETH</>:"0.00"}</p>
                    </div>
                  </div>
   
                  <div className='flex justify-center'>
                    <button className=' -mt-[1rem] bg-purple-700 rounded-full p-[0.1rem] w-[5rem]' onClick={()=> bridgeEth()}>BRIDGE</button>
                  </div>
                      
              </div>
              
          </div>
        </div>
        
    </div>
  )
}

export default Index