import { ethers } from "ethers";
import { genesisMinter, MinterAbi } from "./constants";
import { lineaTestNetwork } from "./networkConfigs";

export const changeNetworkToLineaTestnet= async()=>{
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId:"0xe704"}],
        });
    } catch (error) {
        console.log(error)
    }
}

export const connectContract=async(account)=>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(account[0]); 
        const contract = new ethers.Contract( genesisMinter,MinterAbi, signer);     
    } catch (error) {
        console.log(
            error
        )
    }
}

//export const lineaTestId = "0xe704";