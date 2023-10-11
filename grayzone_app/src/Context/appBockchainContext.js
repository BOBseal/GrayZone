"use client";

import React,{ useState, useEffect } from 'react';
//import { ThirdwebProvider } from '@thirdweb-dev/react';
import {changeNetworkToLineaTestnet, connectContract, connectNFTContract , connectStorageContract, unixTimeToHumanReadable} from "../utils/hooks"
export const DappAppContext = React.createContext();
export const DappAppProvider = ({children})=> {
    const lineaTestId = "0xe704";
    const [user , setUser] = useState({});
    const [account, setAccount] = useState([]);
    const [error , setError] = useState({
        error:{},
        errorMsg:""
    });
    const [userPass , setUserPass] = useState();

    useEffect(() => {
    }, [])
    

    const connectWallet=async()=>{
        try {
            if(window.ethereum){
                const chainId = await window.ethereum.request({ method: "eth_chainId" });
                if(chainId && chainId != lineaTestId){
                    changeNetworkToLineaTestnet();
                }
                const obj = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                await obj;
                if(obj){
                    setUser({network:chainId, wallet:obj[0]});
                    setAccount(obj);
                    return true;
                }
                return false;
            }
            else setError({error: {code :"0x" , msg:"failed"} , errorMsg:"PLEASE INSTALL METAMASK"})
        } catch (error) {
            setError({error: error,errorMsg: "Connect to Metamask Failed"});
        }
    }

    const mint=async()=>{
        try {
            if(user.wallet){
            const contract = await connectContract(user.wallet);
            const m = await contract.Claim();
            await m;
            console.log(m);
            return m;
            //console.log(m);
            }
        } catch (error) {
            console.log(
                error
            )
        }
    }

    const _addToStorage=async(id,uri, data)=>{
        try {
            if(user.wallet){
                const c = await connectStorageContract(user.wallet);
                const tx =  await c.addToStore(id , uri , data);
                return tx
            }
            return;
        } catch (error) {
            console.log(error);
        }
    }

    const _delStorage=async(id , slot)=>{
        try{    
            if(user.wallet){
                const c = await connectStorageContract(user.wallet);
                const tx =  await c.deleteSlot(id , slot);
                return tx
            }
            return;
        } catch (error) {
            console.log(error);
        }
    }

    const _recoverStorage=async(id, slot)=>{
        try {
            if(user.wallet){
                const c = await connectNFTContract(user.wallet);
                const tx = await c.recoverData(id, slot);
                return tx;
            }
            return;
        } catch (error) {
            console.log(error)
        }
    }

    const isPassholder =async()=>{
        try {
            if(user.wallet){
                const c = await connectNFTContract(user.wallet);
                const bal = await c.balanceOf(user.wallet);
                console.log(bal.toNumber());
                console.log("going through")
                return bal.toNumber();
            }
        } catch (error) {
            console.log(error);
            setError({error: error , errorMsg: "Pass Balance Fetch Failed"})
        }
    }

    const getPassInfo = async()=>{
        try {
            try {
                if (user.wallet) {
                  const promises = [];
                  const arr = [];
                  const c = await connectNFTContract(user.wallet);
                  const supply = 100000;
            
                  for (let i = 0; i < supply; i++) {
                    let maps = await c._zonepassmaps(i);
                    let l = [];                        
                    // Check if maps[1] is "0x0000000000000000000000000000000000000000"
                    if (maps[1] === "0x0000000000000000000000000000000000000000") {
                      break; // Exit the loop when the condition is met
                    }
                    let objs = {maps: maps , id: i};
                    promises.push(objs);
                    // You don't need this line: await new Promise(resolve => resolve);
                  }
            
                  const r = await Promise.all(promises);
                  r.forEach(r => {
                    let res = r.maps;
                    let holder = res[1].toUpperCase();
                    let us = user.wallet.toUpperCase();
                    if(holder === us){
                        let ans = [];
                        
                        const mintner = res[0];
                        const holder = res[1];
                        const mch = res[2]
                        const ach = res[3]
                        const mintTime = unixTimeToHumanReadable(res[4].toLocaleString());
                        const lastRen = unixTimeToHumanReadable(res[5].toLocaleString());
                        const exp = unixTimeToHumanReadable(res[6].toLocaleString());
                        const usedSlots = res[7].toNumber();
                        const totalSlots = res[8].toNumber();
                        const points = res[9].toNumber();

                        ans.push(mintner);
                        ans.push(holder);
                        ans.push(mch);
                        ans.push(ach);
                        ans.push(mintTime);
                        ans.push(lastRen);
                        ans.push(exp);
                        ans.push(usedSlots);
                        ans.push(totalSlots);
                        ans.push(points);
                        ans.push(r.id);
                        
                        arr.push(ans);
                    }
                  });
            
                 // console.log(arr);
                  setUserPass(arr);
                  return arr;
                }
              } catch (error) {
                console.log(error);
              }
        } catch (error) {
            console.log(error);
        }
    }
    return(<>
   
    <DappAppContext.Provider value={{user , error, userPass,connectWallet, mint, isPassholder, getPassInfo,
    _delStorage , _addToStorage, _recoverStorage
    }}>
        {children}
    </DappAppContext.Provider>
   
    </>
    )
}