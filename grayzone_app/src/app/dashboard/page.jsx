"use client"
import { changeNetworkToLineaTestnet } from '@/utils/hooks'
//import Link from 'next/link'
import React,{useContext, useEffect, useState} from 'react'
//import Image from 'next/image'
import { DappAppContext } from '@/Context/appBockchainContext'
import { ethers } from "ethers";
import { connectErc20 } from '@/utils/hooks'
import { PassAddress ,TransferUnit } from '@/utils/constants'
import { hexToNumber } from 'viem';

const lineaTestId = "0xe704"
const lineaweth = "0x2C1b868d6596a18e32E61B901E4060C872647b6C"
const zeroAddr = "0x0000000000000000000000000000000000000000"
const pricePercentPoints = 1000;
//0x01D7C804148B6fb7821c36fbDA3bEcd82B25E949 -- tusdc
//0xBe89a1CEC2De3fa75b4103d9F153fd0ee6Ad4411 -- tusdt
const USERDASHBOARD =()=> {
  const{user , connectWallet,getPassInfo , getIdBalance, depositToId , withDrawFromId, getPercentCost,getRevenueData, buyRevenue,idtoid , boostPass, getWeeklyFee, transferPointsFn}= useContext(DappAppContext);
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
  const [pointTx , setPointTx] = useState({
    fromId:0,
    toId:0,
    amount:0
  })
  const [controllers , setControllers] = useState({
    tokenSelected: false,
    tokenId:"",
    loading1: false,
    loading2: false,
    item:{},
    rev:5,
    time:0,
    fee:"",
    cost: 0,
    mode :"",
    percent:0,
    paymentMode : "POINTS"
  })
  

  const getBalances=async(token)=>{
    try {
      console.log(token)
      const ss = await getIdBalance(controllers.item.id, token);
      const con = await connectErc20(user.wallet, token);
      const d = await con.decimals();
      const deci = hexToNumber(d);
      const as = ethers.utils.formatUnits(ss ,deci);
      //console.log(as)
      
     // const bal = await getIdBalance(token);
     // const decimal = await
      setBalances({...balances ,selectToken: as.toString()})
      setControllers({...controllers , loading2: false})  
    } catch (error) {
      console.log(error);
    }
  }

  const handleRevFetch = async(id)=>{
    try {
      const t = await getRevenueData(id);
      setControllers({...controllers, rev:t})
    } catch (error) {
      
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
        return
      }
      if(deposits.amount === '0' ){
        alert("Enter Deposit Amount")
        return
      }
      if(deposits.token && deposits.amount != '0'){
        const con =await connectErc20(user.wallet , deposits.token);
        const deci = await con.decimals();
        const de = hexToNumber(deci);
        const amt = ethers.utils.parseUnits(deposits.amount, de);
        
        console.log(`Decimals: ${de} , Amount: ${amt}`)
        const approveMain = await con.approve(PassAddress.lineaTestnet , amt);
        const appr = await con.approve(TransferUnit.lineaTestnet, amt);
        if(approveMain.hash) {
          //const approveDep= await con.approve(TransferUnit.lineaTestnet , amt);
          
            await depositToId(controllers.item.id , deposits.token , amt );
          
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlePointTransfer= async()=>{
    try {
      if(!pointTx.toId){
        alert("Enter Id to transfer points to");
        return
      }
      if(pointTx.amount == 0){
        alert("Enter Amount of Points to Transfer");
        return
      }
      if(pointTx.toId , pointTx.amount){
        const tx = await transferPointsFn(controllers.item.id , pointTx.toId , pointTx.amount);
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
        //getBalances(ad);
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
        const con =await connectErc20(user.wallet , withdrawals.token);
        const deci = await con.decimals();
        const de = hexToNumber(deci);
        const amt = ethers.utils.parseUnits(withdrawals.amount, de);
        //const cont =await connectErc20(user.wallet , deposits.token);
        await withDrawFromId(controllers.item.id , withdrawals.token ,amt);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleIdTx = async()=>{
    try {
      const con =await connectErc20(user.wallet , idTx.setToken);
      const deci = await con.decimals();
      const de = hexToNumber(deci);
      const amt = ethers.utils.parseUnits(idTx.setAmt, de);
      await idtoid(controllers.item.id , idTx.toId , idTx.setToken , amt);
    } catch (c) {
      console.log(c)
    }
  }

  const extendTime  = async()=>{
    try {
      const tx = await boostPass(controllers.time, controllers.item.id);
      console.log(tx)
    } catch (error) {
      console.log(error)
    }
  }

  const getFee = async()=>{
    try {
      const fee = getWeeklyFee(controllers.time);
      setControllers({...controllers, fee: fee});
    } catch (error) {
      console.log(error)
    }
  }

  const handleRevenue=async(e)=>{
    try {
      if(controllers.paymentMode === "POINTS"){
        const c = e.target.value * pricePercentPoints;
        setControllers({...controllers, cost : c, percent: e.target.value});
      }

      if(controllers.paymentMode ==="ETHER"){
        const p = await getPercentCost();
        const pp = ethers.utils.formatEther(p);
        const c = e.target.value * pp;
        setControllers({...controllers, cost : c, percent:e.target.value});
      }
      
    } catch (error) {
      
    }
  }

  const handleRevenueBuy = async(id) => {
    try {
      if(controllers.paymentMode == "POINTS"){
       const tx = await buyRevenue(id , controllers.percent, true);
      }
      if(controllers.paymentMode == "ETHER"){
        const tx = await buyRevenue(id, controllers.percent, false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      //setControllers({...controllers , loading1: true})
      if(!user.wallet){
        connectWallet();
        if(user.network !=lineaTestId){
          changeNetworkToLineaTestnet()
        }
      }  
      if(user.wallet && b == false){
        handler();
       
      //  getBalances();

      } 
      //setControllers({...controllers , loading1: false})
      return
    } catch (error) {
      console.log(error);
    }
  }, [user, passArr, balances.weth, ad, deposits.token])
  

  return ( 
     <div className='flex flex-col gap-[2.5rem] md:gap-[4rem] bg-[#1D023C] text-white'>
      
        {!controllers.tokenSelected ? 
        <p className=' flex pt-6 justify-center font-semibold text-[2rem] drop-shadow-xl'>Balances:</p>
        :
        <>
        </>
        } 
      
      {!controllers.loading1 ? 
      <div>{ !controllers.tokenSelected ? 
      <div className=' flex flex-col items-center gap-[2.5rem]'>
           
        {passArr.map((item)=>(
          <div key={item.id} className={`flex w-8/12 drop-shadow-lg flex-col gap-4 bg-opacity-70 bg-[#9041ff] text-white text-sm rounded-lg shadow-lg p-2 border-[2px] border-[#7f3fff84] justify-between items-center`}>
            <button onClick={()=> toggleSelect(item)} className='flex w-[14rem] justify-center bg-[#8139e5] rounded-full h-[2rem] text-lg items-center drop-shadow-lg'><p>{`ENTER PASS ID ${item.id} PROFILE`}</p></button>
            <p className='drop-shadow-lg'>PASS ID: {item.id}</p>
            <p className='drop-shadow-lg'>Minted On: {item.mintTime}</p>
          </div>
        ))}
      </div>: <></>}</div>:
        <div className='flex flex-col w-full items-center justify-center'>
          {controllers.loading1 && user.network == lineaTestId? <p className='flex animate-slowerFlicker text-[1.6rem]'>LOADING...</p>:""}
          
          {user.network != lineaTestId ? <p className='flex text-[1.6rem] animate-slowerFlicker'>WRONG CHAIN!! RELOAD PAGE TO FIX</p>:""}
        </div>}

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
      
      {controllers.tokenSelected ? <div className='flex flex-col justify-center items-center md:mt-8 gap-6'>
        <button onClick={()=> toggleSelect()} className='flex w-[14rem] bg-opacity-70 text-white justify-center bg-[#8139e5] rounded-full h-[2rem] text-lg items-center'><p>GO BACK</p></button>
        
        <div className='grid md:grid-cols-2 gap-2 w-11/12 md:w-full'>
          <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem] bg-opacity-70  bg-[#8139e5] rounded-2xl flex-wrap'>
            <h3 className='text-center text-[2rem] font-bold underline pb-4'>PASS GENERAL INFO</h3>
            <p>Pass ID: {controllers.item.id}</p>
            <p>Points Balance: {controllers.item.points}</p>
            <p>Minted On: {controllers.item.mintTime}</p>
            <p>Expiry On: {controllers.item.expiry}</p>
            <p>Active On Chain ID: {controllers.item.activeChainId}</p>
            <p>Storage Plan : {controllers.item.totalSlots} Slots</p>
            <p>Used Storage: {controllers.item.useSlots} Slots</p>
          </div>


          <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem] bg-opacity-70 bg-[#8139e5] rounded-2xl flex-wrap'>
            <h3 className='text-center text-[2rem] font-bold underline pb-4'>PASS BALANCES INFO</h3>
            
            <div className='flex flex-col pb-4'>
              Balance: {balances.selectToken? <>{balances.selectToken}</>:"Fetch Balance First"}
            </div>

            <p>Select Token:</p>
            <select className='flex flex-col text-black' value={ad} defaultValue={lineaweth} onChange={(e)=> setAd(e.target.value)}>
              <option>Select Option</option>
              <option value={lineaweth}>WETH BALANCES</option>
              <option value={zeroAddr}>ETH BALANCES</option>
              <option value={"0x01D7C804148B6fb7821c36fbDA3bEcd82B25E949"}>USDC BALANCES</option>
            </select>

            <button onClick={()=> getBalances(ad)} className='border p-2 rounded-lg'>Fetch Balance Details</button>

          </div>


        <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem] bg-opacity-70 bg-[#8139e5] rounded-2xl flex-wrap'>
          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>DEPOSIT TO PASS</h3>

          <p>Select Token:</p>
          <select className='flex flex-col text-black' value={deposits.token} defaultValue={lineaweth} onChange={(e)=> setDeposits({...deposits,token:e.target.value})}>
            <option>Select Option</option>
            <option value={lineaweth}>WETH</option>
            <option value={zeroAddr}>ETH</option>
            <option value={"0x01D7C804148B6fb7821c36fbDA3bEcd82B25E949"}>USDC</option>
          </select>
          <input className='text-black' type={'number'} placeholder="Enter Deposit Amount" onChange={(e)=> setDeposits({...deposits , amount:e.target.value})}/>
          <button onClick={()=> handleDeposit()} className='border p-2 rounded-lg'>DEPOSIT</button>

          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>WITHDRAW FROM PASS</h3>

          <p>Select Token:</p>
          <select className='flex flex-col text-black' value={withdrawals.token} defaultValue={lineaweth} onChange={(e)=> setWithdrawals({...withdrawals,token:e.target.value})}>
            <option>Select Option</option>
            <option value={lineaweth}>WETH</option>
            <option value={zeroAddr}>ETH</option>
            <option value={"0x01D7C804148B6fb7821c36fbDA3bEcd82B25E949"}>USDC</option>
          </select>
          <input className='text-black' type={'number'} placeholder="Enter Withdraw Amount" onChange={(e)=> setWithdrawals({...withdrawals , amount:e.target.value})}/>
          <button onClick={()=> handleWithdraw()} className='border p-2 rounded-lg'>WITHDRAW</button>
        </div>

        
        
        <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem] bg-opacity-70 bg-[#8139e5] rounded-2xl flex-wrap'>
          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>PASS-PASS TRANSFER</h3>

          <p>Select Token:</p>
          <select className='flex flex-col text-black' value={idTx.setToken} defaultValue={lineaweth} onChange={(e)=> setIdTx({...idTx,setToken:e.target.value})}>
            <option>Select Option</option>
            <option value={lineaweth}>WETH</option>
            <option value={zeroAddr}>ETH</option>
            <option value={"0x01D7C804148B6fb7821c36fbDA3bEcd82B25E949"}>USDC</option>
          </select>
        <p>Enter Token ID to Transfer To:</p>
        <input type={'number'} className="text-black" placeholder='enter token Id to transfer to' onChange={(e)=> setIdTx({...idTx, toId: e.target.value})}/>
        <p>Enter Amount to Transfer:</p>
        <input type={'number'} className="text-black" placeholder='enter Amount' onChange={(e)=> setIdTx({...idTx, setAmt: e.target.value})}/>
        <button onClick={()=> handleIdTx()} className='border p-2 rounded-lg'>TRANSFER</button>

        </div>


        <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem] bg-opacity-70  bg-[#8139e5] rounded-2xl flex-wrap'>
          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>EXTEND EXPIRY</h3>

          <p>Select Number of Weeks to Extend:</p>
          
          <input type={'number'} className="text-black" placeholder='Enter Weeks ,Max 8' max={8} onChange={(e)=> setControllers({...controllers, time: e.target.value})}/>
          <p>Applicable Fee:{controllers.fee} </p>
          <button onClick={()=> getFee()} className='border p-2 rounded-lg'>Check Fee Applicable</button>
          <button onClick={()=> extendTime()} className='border p-2 rounded-lg'>Extend</button>

        </div>

        <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem] bg-opacity-70  bg-[#8139e5] rounded-2xl flex-wrap'>
          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>TRANSFER POINTS</h3>
          <input type={'number'} className="text-black" placeholder='Enter Token Id to Transfer to' onChange={(e)=> setPointTx({...pointTx, toId: e.target.value})}/>
          <input type={'number'} className="text-black" placeholder='Enter Points Amount to Transfer' max={controllers.item.points} onChange={(e)=> setPointTx({...pointTx, amount: e.target.value})}/>
          <button onClick={()=> handlePointTransfer()} className='border p-2 rounded-lg'>TRANSFER</button>

        </div>

        <div className='flex flex-col pt-4 gap-1 pb-4 text-white p-[4rem] bg-opacity-70  bg-[#8139e5] rounded-2xl flex-wrap'>
          <h3 className='text-center text-[1.8rem] font-bold underline pb-4'>BUY REVENUE SHARES</h3>
            
            <p>Current Rate : {controllers.rev <5 ? <>5 %</>:<>{controllers.rev} %</>} of Id Revenue</p>
            <button onClick={()=>handleRevFetch(controllers.item.id)} className='border p-1 rounded-lg'>Refresh Data</button>

            <div className='flex flex-col items-center gap-2'>
              <p className='flex flex-col items-center'>BUY SHARES (Max 50%): <input type={'number'} max={50} onChange={(e)=>handleRevenue(e)} className='text-black'/></p>
              
              <select className='text-black' value={controllers.paymentMode} defaultValue={"POINTS"} onChange={(e)=> setControllers({...controllers, paymentMode:e.target.value})}>
                <option value={"POINTS"}>Pay With Points</option>
              </select>
              <p>Estimated Cost : {controllers.cost} {controllers.paymentMode}</p>
              <button className='border p-2 rounded-lg' onClick={()=>handleRevenueBuy(controllers.item.id)}>BUY REVENUE SHARES</button>
            </div>
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
        <h2 className='font-bold text-[2.5rem]'>DASHBOARD</h2>

        <button>...</button>
      </div>
      </div> :<div className='flex justify-center text-[1.5rem] pb-4 md:text-[2rem] font-semibold'>ZONEPASS HOLDING LIST</div>}
     </div> 
   ) 
 }

export default USERDASHBOARD
