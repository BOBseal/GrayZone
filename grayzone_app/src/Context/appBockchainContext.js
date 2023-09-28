"use client";

import Image from 'next/image';
import React,{ useState } from 'react';

export const DappAppContext = React.createContext();
export const DappAppProvider = ({children})=> {

    const [user , setUser] = useState({});
    const [userWallet , setUserWallet] = useState("");

    const connectWallet=(userWallet)=>{

    }

    const connectContract=(contract)=>{
        
    }

    return(<DappAppContext.Provider value={{user , userWallet}}>
        {children}
    </DappAppContext.Provider>)
}