"use client";

import React,{ useState, useEffect } from 'react';
//import { ThirdwebProvider } from '@thirdweb-dev/react';
import {changeNetworkToLineaTestnet, connectContract, connectNFTContract} from "../utils/hooks"
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
    return(<>
   
    <DappAppContext.Provider value={{user , error,connectWallet, mint, isPassholder}}>
        {children}
    </DappAppContext.Provider>
   
    </>
    )
}