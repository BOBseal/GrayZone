import { ethers } from "ethers";
import { genesisMinter, MinterAbi , PassAbi , PassAddress } from "./constants";
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
        const signer = provider.getSigner(account); 
        const contract = new ethers.Contract( genesisMinter.lineaTestnet,MinterAbi, signer);
        return contract;     
    } catch (error) {
        console.log(
            error
        )
    }
}

export const connectNFTContract = async(account)=>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(account); 
        const contract = new ethers.Contract( PassAddress.lineaTestnet,PassAbi, signer);
        return contract;     
    } catch (error) {
        console.log(
            error
        )
    }
}

export const homelink = "http://localhost:3000"

//export const lineaTestId = "0xe704";