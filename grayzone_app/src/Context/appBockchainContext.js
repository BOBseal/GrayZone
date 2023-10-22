"use client";

import React,{ useState, useEffect } from 'react';
//import { ThirdwebProvider } from '@thirdweb-dev/react';
import {
    changeNetworkToLineaTestnet,
    connectContract, 
    connectNFTContract , 
    connectStorageContract, 
    unixTimeToHumanReadable,
    connectTransferContract,
    connectMarketPlace
} from "../utils/hooks"
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
    const [userItems , setUserItems] = useState({});

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

    const getStorage = async(id, slot)=>{
        try{    
            if(user.wallet){
                const c = await connectStorageContract(user.wallet);
                const tx =  await c.getStorage(user.wallet , id , slot);
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
                        const mintTime = unixTimeToHumanReadable(res[5].toLocaleString());
                        const lastRen = unixTimeToHumanReadable(res[6].toLocaleString());
                        const exp = unixTimeToHumanReadable(res[7].toLocaleString());
                        const usedSlots = res[8].toNumber();
                        const totalSlots = res[9].toNumber();
                        const points = res[10].toNumber();
                        const id_ = res[4].toNumber();
                        let userBalances = {id: id_ , minter: mintner , holder: holder , mintChainId: mch , activeChainId: ach, mintTime: mintTime
                        , lastRenewal: lastRen , expiry: exp , totalSlots: totalSlots , useSlots: usedSlots , points: points }
                        
                        
                        arr.push(userBalances);
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

    const getIdBalance = async(id , token) =>{
        try {
            if(user.wallet){
            const c = await connectNFTContract(user.wallet);
            const bal = await c.getIdBalance(token , id);
            return bal; 
            }
        } catch (error) {
            console.log(error);
        }
    }

    const depositToId = async(id , token , amount)=>{
        try {
            if(user.wallet){
            const con = await connectTransferContract(user.wallet);
            const deposit = await con.deposit(id, token , amount);
            return deposit;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const withDrawFromId = async(id , token , amount)=>{
        try {
            if(user.wallet){
            const con = await connectTransferContract(user.wallet);
            const deposit = await con.withdraw(id, token, user.wallet , amount);
            return deposit;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const idtoid = async(id1 , id2 , token , amount) =>{
        try {
            if(user.wallet){
                const con = await connectTransferContract(user.wallet);
                const tx = await con.idToId(id1 , id2 , token , amount);
                return tx;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const listNFT = async(nftAdr , id , paymentToken ,price, days)=>{
        try {
            if(user.wallet){
                const list = {
                    // address of the contract the asset you want to list is on
                    assetContractAddress: nftAdr,
                    // token ID of the asset you want to list
                    tokenId: id,
                    // how many of the asset you want to list
                    quantity: 1,
                    // address of the currency contract that will be used to pay for the listing
                    currencyContractAddress: paymentToken,
                    // The price to pay per unit of NFTs listed.
                    pricePerToken: price,
                    // when should the listing open up for offers
                    startTimestamp: new Date(Date.now()),
                    // how long the listing will be open for
                    endTimestamp: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                    // Whether the listing is reserved for a specific set of buyers.
                    isReservedListing: false
                }
                const con = await connectMarketPlace(user.wallet);
                const tx = await con.createListing(list);
                return tx.listingId;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const cancelListing= async(listingId)=>{
        try {
            if(user.wallet){
                const con = await connectMarketPlace(user.wallet);
                const tx = await con.cancelListing(listingId);
                return tx.listingId;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateListing= async(listingId , nftAdr , id , paymentToken ,price, days)=>{
        try {
            if(user.wallet){
                const list = {
                    // address of the contract the asset you want to list is on
                    assetContractAddress: nftAdr,
                    // token ID of the asset you want to list
                    tokenId: id,
                    // how many of the asset you want to list
                    quantity: 1,
                    // address of the currency contract that will be used to pay for the listing
                    currencyContractAddress: paymentToken,
                    // The price to pay per unit of NFTs listed.
                    pricePerToken: price,
                    // when should the listing open up for offers
                    startTimestamp: new Date(Date.now()),
                    // how long the listing will be open for
                    endTimestamp: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                    // Whether the listing is reserved for a specific set of buyers.
                    isReservedListing: false
                }
                const con = await connectMarketPlace(user.wallet);
                const tx = await con.cancelListing(listingId , list);
                return tx.listingId;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllListings = async()=>{
        try {
            if(user.wallet){
                const con = await connectMarketPlace(user.wallet)
                const tx = await con.getAll();
                return tx
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAllValidListings = async()=>{
        try {
            if(user.wallet){
                const con = await connectMarketPlace(user.wallet)
                const tx = await con.getAllValid();
                return tx
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getTotalListings = async()=>{
        try {
            if(user.wallet){
                const con = await connectMarketPlace(user.wallet)
                const tx = await con.totalListings();
                return tx
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(<>
   
    <DappAppContext.Provider value={{user , error, userPass,connectWallet, mint, isPassholder, getPassInfo,
    _delStorage , _addToStorage, _recoverStorage , depositToId , withDrawFromId, getIdBalance, idtoid , listNFT,
    cancelListing , updateListing, getAllListings , getAllValidListings, getTotalListings, getStorage
    }}>
        {children}
    </DappAppContext.Provider>
   
    </>
    )
}