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
  

  const getBalances=async(token)=>{
    try {
      const w = await getIdBalance(passArr[10], lineaweth);
      const str = ethers.utils.formatUnits(w , 18);
      console.log(str)
      setBalances({...balances ,weth:str})
      //console.log(wth);
      if(token){
      const ss = await getIdBalance(passArr[10], token);
      const as = ethers.utils.formatUnits(ss , 18);
     // const bal = await getIdBalance(token);
     // const decimal = await
      setBalances({...balances ,selectToken: as.toString()})  
    }
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
        const tx = await depositToId(passArr[10] , deposits.token , amt );
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
        const tx = await withDrawFromId(passArr[10] , withdrawals.token ,amt);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleIdTx = async()=>{
    try {
      const amt = ethers.utils.parseUnits(idTx.setAmt);
      const tx = await idtoid(passArr[10] , idTx.toId , idTx.setToken , amt);
    } catch (c) {
      console.log(c)
    }
  }

  useEffect(() => {
    try {
      if(!user.wallet){
        connectWallet();
      } else 
      if(user.wallet && b == false){
        handler();
       
        getBalances();

      } 
      return
    } catch (error) {
      console.log(error);
    }
  }, [user, passArr, balances.weth, ad, deposits.token])
  

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
      </div>
      
      <div className='flex flex-col justify-center items-center'>
        <h2 className='font-bold text-[2.5rem]'>ZONE SERVICES:</h2>

        <button>DECENTRALISED STORAGE SERVICE GOING ON SOON</button>
      </div>
     </div> 
   ) 
 }

export default USERDASHBOARD
