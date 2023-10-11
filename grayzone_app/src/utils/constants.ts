import abi from './ABIS/passAbi.json'
import bbi from './ABIS/genesisMintAbi.json'
import sbi from './ABIS/GRAYSTORE.json'

export const PassAddress ={
    goerli: {
        address: "0xEeAE8b69A51f6e8721cb5F42f858E6A8004e1503"
    },
    lineaTestnet:"0xf8358326EeB6807dddB934AbF73B14152E4a6C3E"
};

export const genesisMinter = {
    goerli:{
        address:"0xB1472af0B33A96b5E669E572A35B0D8f915ebB4a",
        chainId : "0x5"
    },
    lineaTestnet:"0xd70f727Bb0a93fdC0e4d532Fb49cAFA8582cf55e"
}

export const storageUnit = {
    goerli:"",
    lineaTestnet:"0xb6b74C324B7B37215c3Ff5b14E05f31Dc7a66303"
}

export const MinterAbi = bbi.abi;
export const PassAbi = abi.abi;
export const StorageAbi = sbi.abi;