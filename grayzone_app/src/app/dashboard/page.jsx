"use client"
import { changeNetworkToLineaTestnet } from '@/utils/hooks'
import Link from 'next/link'
import React,{useContext, useEffect, useState} from 'react'
import Image from 'next/image'
import { DappAppContext } from '@/Context/appBockchainContext'
import { Contract, ethers } from "ethers";
import { connectErc20 } from '@/utils/hooks'
import { PassAddress ,TransferUnit } from '@/utils/constants'

const lineaTestId = "0xe704"
const lineaweth = "0x2C1b868d6596a18e32E61B901E4060C872647b6C"
const zeroAddr = "0x0000000000000000000000000000000000000000"

const USERDASHBOARD =()=> {
  const{user , connectWallet,getPassInfo , getIdBalance, depositToId , withDrawFromId, idtoid}= useContext(DappAppContext);
  const [passArr , setPassArr] = useState([]);
  const [b , setB] = useState(false);
  const [balances , setBalances] = useState({
    weth:'',
    selectToken:''
  })
  const [ad , setAd] = useState("");
  const [deposits , setDeposits] = useState({
    token:"",
    amount:'',
  })
  const [withdrawals , setWithdrawals] = useState({
   token:"",
   amount:'' 
  })

  const [idTx , setIdTx] = useState({
    setAmt:"",
    setToken:"",
    frmId:0,
    toId:0
  })
  const [controllers , setControllers] = useState({
    tokenSelected: false,
    tokenId:"",
    loading1: false,
    loading2: false,
    item:{}
  })
  

  const getBalances=async(token)=>{
    try {
      console.log(token)
      const ss = await getIdBalance(controllers.item.id, token);
      const as = ethers.utils.formatUnits(ss , 18);
      //console.log(as)
      
     // const bal = await getIdBalance(token);
     // const decimal = await
      setBalances({...balances ,selectToken: as.toString()})
      setControllers({...controllers , loading2: false})  
    } catch (error) {
      console.log(error);
    }
  }

  async function handler(){
    try {
      setControllers({...controllers , loading1: true})
      const a = await getPassInfo();
      console.log(a);
      const s = a.flat();
      console.log(s);
      setPassArr(s);
      setB(true);
      setControllers({...controllers , loading1: false})
      return a;
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeposit = async()=>{
    try {
      if(!deposits.token) {
        alert("Enter Token To Deposit")
      }
      if(deposits.amount === '0' ){
        alert("Enter Deposit Amount")
      }
      if(deposits.token && deposits.amount != '0'){
        const amt = ethers.utils.parseUnits(deposits.amount, 18);
        const con =await connectErc20(user.wallet , deposits.token);
        const approveMain = await con.approve(PassAddress.lineaTestnet , amt);
        const approveDep= await con.approve(TransferUnit.lineaTestnet , amt);
        const tx = await depositToId(controllers.item.id , deposits.token , amt );
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleSelect =(event)=>{
    try {
      if(controllers.tokenSelected== true){
        setControllers({...controllers,tokenSelected: false})
      } 
      if(controllers.tokenSelected== false){
        setControllers({...controllers,tokenSelected: true , item: event})
      }
    } catch (error) {
     console.log(error) 
    }
  }

  const handleWithdraw = async()=>{
    try {
      if(!withdrawals.token) {
        alert("Enter Token To Deposit")
      }
      if(withdrawals.amount === '0' ){
        alert("Enter Deposit Amount")
      }
      if(withdrawals.token && withdrawals.amount != '0'){
        const amt = ethers.utils.parseUnits(withdrawals.amount, 18);
       
       
        //const cont =await connectErc20(user.wallet , deposits.token);
        const tx = await withDrawFromId(controllers.item.id , withdrawals.token ,amt);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleIdTx = async()=>{
    try {
      const amt = ethers.utils.parseUnits(idTx.setAmt);
      const tx = await idtoid(controllers.item.id , idTx.toId , idTx.setToken , amt);
    } catch (c) {
      console.log(c)
    }
  }

  useEffect(() => {
    try {
      setControllers({...controllers , loading1: true})
      if(!user.wallet){
        connectWallet();
      } else 
      if(user.wallet && b == false){
        handler();
       
      //  getBalances();

      } 
      setControllers({...controllers , loading1: false})
      return
    } catch (error) {
      console.log(error);
    }
  }, [user, passArr, balances.weth, ad, deposits.token])
  

  return ( 
     <div className='flex flex-col gap-[4rem]'>
      
      {!controllers.loading1 && !controllers.tokenSelected ? <div className=' flex flex-col items-center'>
        <p className=' flex pt-6 pb-6 justify-center font-semibold text-[2rem] drop-shadow-xl'>Balances:</p>
        {passArr.map((item)=>(
          <div key={item.id} className={`flex w-8/12 flex-col gap-4 bg-[#9041ff] text-white text-sm rounded-lg shadow-lg p-2 border-[2px] border-[#7f3fff84] justify-between items-center`}>
            <button onClick={()=> toggleSelect(item)} className='flex w-[14rem] justify-center bg-[#8139e5] rounded-full h-[2rem] text-lg items-center'><p>ENTER PASS PROFILE</p></button>
            <p>PASS ID: {item.id}</p>
            <p>Minted On: {item.mintTime}</p>
          </div>
        ))}
      </div>: <></>}
      {/*<div className='flex flex-col flex-wrap justify-center items-center font-semibold gap-1'>
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
        </div>*/}
      
      {controllers.tokenSelected ? <div className='flex flex-col justify-center items-center mt-8 gap-6'>
        <button onClick={()=> toggleSelect()} className='flex w-[14rem] text-white justify-center bg-[#8139e5] rounded-full h-[2rem] text-lg items-center'><p>GO BACK</p></button>
        
        <div className='flex flex-col md:flex-row gap-2'>
          <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem]  bg-[#8139e5] rounded-2xl flex-wrap'>
            <h3 className='text-center text-[2rem] font-bold underline pb-4'>PASS GENERAL INFO</h3>
            <p>Pass ID: {controllers.item.id}</p>
            <p>Points Balance: {controllers.item.points}</p>
            <p>Minted On: {controllers.item.mintTime}</p>
            <p>Expiry On: {controllers.item.expiry}</p>
            <p>Active On Chain ID: {controllers.item.activeChainId}</p>
            <p>Storage Plan : {controllers.item.totalSlots} Slots</p>
            <p>Used Storage: {controllers.item.useSlots} Slots</p>
          </div>


          <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem]  bg-[#8139e5] rounded-2xl flex-wrap'>
            <h3 className='text-center text-[2rem] font-bold underline pb-4'>PASS BALANCES INFO</h3>
            
            <div className='flex flex-col pb-4'>
              Balance: {balances.selectToken? <>{balances.selectToken}</>:"Fetch Balance First"}
            </div>

            <p>Select Token:</p>
            <select className='flex flex-col text-black' value={ad} defaultValue={lineaweth} onChange={(e)=> setAd(e.target.value)}>
              <option>Select Option</option>
              <option value={lineaweth}>WETH BALANCES</option>
              <option value={zeroAddr}>ETH BALANCES</option>
              <option>USDC BALANCES</option>
            </select>

            <button onClick={()=> getBalances(ad)}>Fetch Balance Details</button>

          </div>

        </div>

        <div className='flex flex-col md:flex-row gap-2'>

        <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem]  bg-[#8139e5] rounded-2xl flex-wrap'>
          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>DEPOSIT TO PASS</h3>

          <p>Select Token:</p>
          <select className='flex flex-col text-black' value={deposits.token} defaultValue={lineaweth} onChange={(e)=> setDeposits({...deposits,token:e.target.value})}>
            <option>Select Option</option>
            <option value={lineaweth}>WETH</option>
            <option value={zeroAddr}>ETH</option>
            <option>USDC</option>
          </select>
          <input className='text-black' type={'number'} placeholder="Enter Deposit Amount" onChange={(e)=> setDeposits({...deposits , amount:e.target.value})}/>
          <button onClick={()=> handleDeposit()}>DEPOSIT</button>

          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>WITHDRAW FROM PASS</h3>

          <p>Select Token:</p>
          <select className='flex flex-col text-black' value={withdrawals.token} defaultValue={lineaweth} onChange={(e)=> setWithdrawals({...withdrawals,token:e.target.value})}>
            <option>Select Option</option>
            <option value={lineaweth}>WETH</option>
            <option value={zeroAddr}>ETH</option>
            <option>USDC</option>
          </select>
          <input className='text-black' type={'number'} placeholder="Enter Withdraw Amount" onChange={(e)=> setWithdrawals({...withdrawals , amount:e.target.value})}/>
          <button onClick={()=> handleWithdraw()}>WITHDRAW</button>
        </div>

        
        
        <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem]  bg-[#8139e5] rounded-2xl flex-wrap'>
          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>PASS-PASS TRANSFER</h3>

          <p>Select Token:</p>
          <select className='flex flex-col text-black' value={idTx.setToken} defaultValue={lineaweth} onChange={(e)=> setIdTx({...idTx,setToken:e.target.value})}>
            <option>Select Option</option>
            <option value={lineaweth}>WETH</option>
            <option value={zeroAddr}>ETH</option>
            <option>USDC</option>
          </select>
        <p>Enter Token ID to Transfer To:</p>
        <input type={'number'} className="text-black" placeholder='enter token Id to transfer to' onChange={(e)=> setIdTx({...idTx, toId: e.target.value})}/>
        <p>Enter Amount to Transfer:</p>
        <input type={'number'} className="text-black" placeholder='enter Amount' onChange={(e)=> setIdTx({...idTx, setAmt: e.target.value})}/>
        <button onClick={()=> handleIdTx()}>TRANSFER</button>

        </div>
      </div>

        
        {/*<div>
        <p>ID DEPOSIT BALANCE Details</p>
        <p>ID Weth Balances: {balances.weth ? <>{balances.weth}</>:"0"} </p>
        <p>Selected Token Balances: {balances.selectToken?<>{balances.selectToken}</>:"0"}</p>
        <input type={'text'} placeholder="Enter Token Address" onChange={(e)=> setAd(e.target.value)}/>
        <button onClick={()=> getBalances(ad)}>Fetch Balances</button>
        </div>

      <div className='flex flex-col'>
        Deposit To Pass:
        <input type={'text'} placeholder="Enter Token Address" onChange={(e)=> setDeposits({...deposits, token : e.target.value})}/>
        <input type={'number'} placeholder="Enter Amount to Deposit" onChange={(e)=> setDeposits({...deposits , amount:e.target.value})}/>
        <button onClick={()=> handleDeposit()}>Trigger Deposit</button>
      </div>

      <div className='flex flex-col'>
        Withdraw From Pass:
        <input type={'text'} placeholder="Enter Token Address" onChange={(e)=> setWithdrawals({...withdrawals , token:e.target.value})}/>
        <input type={'number'} placeholder="Enter Amount to Deposit" onChange={(e)=> setWithdrawals({...withdrawals , amount:e.target.value})}/>
        <button onClick={()=> handleWithdraw()}>Trigger Withdraw</button>
      </div>

      <div className='flex flex-col'>
        Transfer Balances Id-Id
        <input type={'number'} placeholder='enter token Id to transfer to' onChange={(e)=> setIdTx({...idTx, toId: e.target.value})}/>
        <input type={'text'} placeholder='enter token address to transfer' onChange={(e)=> setIdTx({...idTx, setToken: e.target.value})}/>
        <input type={'number'} placeholder='enter Amount' onChange={(e)=> setIdTx({...idTx, setAmt: e.target.value})}/>
        <button onClick={()=> handleIdTx()}>Trigger Transfer</button>
      </div>*/}
      
      <div className='flex flex-col justify-center items-center'>
        <h2 className='font-bold text-[2.5rem]'>ZONEPASS DASHBOARD</h2>

        <button>...</button>
      </div>
      </div> :<div className='flex justify-center text-[2rem] font-semibold'>ZONEPASS HOLDING LIST</div>}
     </div> 
   ) 
 }

export default USERDASHBOARD
