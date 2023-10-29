import abi from './ABIS/passAbi.json'
import bbi from './ABIS/genesisMintAbi.json'
import sbi from './ABIS/GRAYSTORE.json'
import tbi from './ABIS/TransferAbi.json'
import ebi from './ABIS/erc20.json'
import mbi from './ABIS/NftMarket.json'
import fbi from './ABIS/Form.json'

export const PassAddress ={
    goerli: {
        address: "0xEeAE8b69A51f6e8721cb5F42f858E6A8004e1503"
    },
    lineaTestnet:"0xe54EB96f2087BD63110c7253eCc42c9E76c076eC"
};

export const genesisMinter = {
    goerli:{
        address:"0xB1472af0B33A96b5E669E572A35B0D8f915ebB4a",
        chainId : "0x5"
    },
    lineaTestnet:"0xD47d70EdEea2a55eeaD97E79a588a236a1756F81"
}

export const storageUnit = {
    goerli:"",
    lineaTestnet:"0x69B17F587fb5aDaCb581f5D4b8607F92C556e04A"
}

export const TransferUnit={
    goerli:"",
    lineaTestnet:"0x981A02Bf14e82770115D0EF1FC56AbD2D31834DC"
}

export const Market ={
    lineaTestnet:"0x49f8198a701c27d86a1F5fb461F80d8569751F45"
}

export const HireForm = {
    lineaTestnet:"0x90592ddb549608376960f89cAa2C123AA3A36e26",
    fuse:"0x7ECB4991B540875201fbdc13e99eA0BaFcFED942",
    mantle:"0xB656868610823660BBe4E09be14297C8077A2669"
}

export const MinterAbi = bbi.abi;
export const PassAbi = abi.abi;
export const StorageAbi = sbi.abi;
export const TransferAbi = tbi.abi;
export const ERC20Abi = ebi.abi;
export const MarketAbi = mbi.abi;
export const FormAbi = fbi.abi;