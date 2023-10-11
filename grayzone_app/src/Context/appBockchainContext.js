"use client";

import React,{ useState, useEffect } from 'react';
//import { ThirdwebProvider } from '@thirdweb-dev/react';
import {changeNetworkToLineaTestnet, connectContract, connectNFTContract , connectStorageContract} from "../utils/hooks"
export const DappAppContext = React.createContext();
export const DappAppProvider = ({children})=> {
    const lineaTestId = "0xe704";
    const [user , setUser] = useState({});
    const [account, setAccount] = useState([]);
    const [error , setError] = useState({
        error:{},
        errorMsg:""
    });

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
            let arr =[];
            const c = await connectNFTContract(user.wallet);
            const supply = await c.totalSupply();
            console.log(supply.toNumber());
            for(let i = 0 ; i<supply; i++){
             let maps = await c._zonepassmaps(i);
             if(maps[1] === account[0]){
                console.log("Match");
                arr.push(maps);
             }  
            }
           // console.log(arr);
            return arr;
        } catch (error) {
            console.log(error);
        }
    }
    return(<>
   
    <DappAppContext.Provider value={{user , error,connectWallet, mint, isPassholder, getPassInfo,
    _delStorage , _addToStorage, _recoverStorage
    }}>
        {children}
    </DappAppContext.Provider>
   
    </>
    )
}