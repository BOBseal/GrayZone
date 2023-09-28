import abi from './ABIS/passAbi.json'
import bbi from './ABIS/genesisMintAbi.json'

export const PassAddress ={
    goerli: {
        address: "0xEeAE8b69A51f6e8721cb5F42f858E6A8004e1503",
        chainId: "0x5"
    }
};

export const genesisMinter = {
    goerli:{
        address:"0xB1472af0B33A96b5E669E572A35B0D8f915ebB4a",
        chainId : "0x5"
    }
}

export const MinterAbi = bbi.abi;
export const PassAbi = abi.abi;